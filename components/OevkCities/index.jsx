import React, { useState, useEffect } from 'react'
import ReactJson from 'react-json-viewer'
import {
  Form,
  Input,
  Select,
} from 'antd';
import tszService from '../../services/tszService'
import MapBase from '../MapBase'
import styled from 'styled-components'
import zipService from '../../services/zipService'
import Legend from '../Legend'
import useValasztokerulet from '../../hooks/useValasztokerulet'

const { Item } = Form

const Wrap = styled.div`
  display: flex;
  * {
    margin: 6px 6px 0 0;
  }
`

const MapWrap = styled.div`
  width: 100%;
`

const OevkCities = ({
  election = "ogy2018",
  showSearch = true
}) => {
  const [selectedVk, setSelectedVk] = useState()
  const [settlements, setSettlements] = useState()
  const [settlementResult, setSettlementResult] = useState()

  const geoJsonToPoly = geo => (
    geo?.coordinates[0].map(([lng, lat]) => ({ lng, lat }))    
  )

  const { getAllVks, getVkDetails } = useValasztokerulet

  const oevk = getVkDetails({ id: selectedVk, election }) || {}

  const summary = settlements?.reduce((acc, { szavazokorDarab, valasztokSzama }) => ({
    szavazokorDarab: acc.szavazokorDarab + (szavazokorDarab || 0),
    valasztokSzama: acc.valasztokSzama + valasztokSzama,
    kozigEgysegNeve: acc.kozigEgysegNeve + 1
  }),{
    szavazokorDarab: 0,
    valasztokSzama: 0,
    kozigEgysegNeve: 0
  })

  useEffect(() => {
    if (!oevk.leiras) return
    const query = [
      { $match: {
        "valasztokerulet.leiras": oevk.leiras,
      } },
      { $group: {
          _id: "$kozigEgyseg",
          szavazokorDarab: { $sum: 1 },
          valasztokSzama: { $sum: "$valasztokSzama" }
      } },  
      { $sort: { "_id.kozigEgysegNeve": 1 } },
      { $project: {
        kozigEgysegNeve: "$_id.kozigEgysegNeve",
        valasztokSzama: 1,
        szavazokorDarab: 1,
        _id: 0,
        rank: 1      
      } }
    ]
    tszService.aggregate({ query, election })
    .then(({ data }) => setSettlements(data))
    .catch(e => console.log(e))
  },[oevk, election])


  const allVks = getAllVks({ election })

  const [lng, lat] = oevk?.korzethatar?.coordinates[0][0] || [19, 47]

  useEffect(() => {
    if (!settlements?.length) {
      setSettlementResult(null)
      return
    }

    const query = [
      { $match: {
          name: { $in: settlements.map(({ kozigEgysegNeve }) => kozigEgysegNeve.replace('.ker', '. kerület')) }
      }}
    ]

    zipService.aggregate({ query, path: '/settlements' })
    .then(({ data }) => setSettlementResult(data))

  }, [settlements])

  return (
    <>
      <h1>Valasztókerületek</h1>
      {showSearch && (
        <Item
        label="Választókerület"
        >
          <Select
            showSearch
            placeholder="Választókerület"
            onSelect={setSelectedVk}
            options={allVks?.map(({ _id: value, leiras: label }) => ({ value, label }))}
          />
        </Item>
      )}
      <Wrap>
      {settlements && (
        <ReactJson json={[...settlements, summary ]} />
      )}
      {oevk && (
        <MapWrap>
          <MapBase
            center={{ lat, lng }}
            zoom={9}
          >
            <MapBase.EvkPolygon
              unfilled
              paths={geoJsonToPoly(oevk?.korzethatar)}
            />          
            {settlementResult?.map?.(settlement => (
              <>
                <MapBase.SzkPolygon
                  paths={settlement?.boundaries?.coordinates[0].map(([lng, lat]) => ({ lng, lat }))}
                />
              </>
            ))}
          </MapBase>
          <Legend stroke="#FF3333AA" fill="#386FB300" text="OEVK határ" />
          <Legend stroke="#386FB3CC" fill="#386FB355" text="Település-határok" />
        </MapWrap>
      )}
      </Wrap>
    </>
  )
}

export default OevkCities
