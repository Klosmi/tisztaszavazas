import React, { useState, useEffect } from 'react'
import ReactJson from 'react-json-viewer'
import {
  Form,
  PageHeader,
  Select,
} from 'antd';
import tszService from '../../services/tszService'
import MapBase from '../MapBase'
import styled from 'styled-components'
import zipService from '../../services/zipService'
import Legend from '../Legend'
import useValasztokerulet from '../../hooks/useValasztokerulet'
import optionFilter from '../../functions/optionFilter'
import useValasztas from '../../hooks/useValasztas';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';

const { Item } = Form

const Wrap = styled.div`
  display: flex;
  flex-direction: ${({ horizontal }) => horizontal ? 'row' : 'column' };
  * {
    margin: 6px 6px 0 0;
  }
`

const MapWrap = styled.div`
  width: 100%;
`

const PageHeaderStyled = styled(PageHeader)`
  padding: 16px 4px;
`

const OevkCities = ({
  election = "ogy2018",
  showSearch = true
}) => {
  const [selectedVk, setSelectedVk] = useState()
  const [settlements, setSettlements] = useState()
  const [settlementResult, setSettlementResult] = useState()

  const { leiras: electionDescription } = useValasztas({ election }) || {}

  const geoJsonToPoly = geo => (
    geo?.coordinates[0].map(([lng, lat]) => ({ lng, lat }))    
  )

  const { getAllVks, getVkDetails } = useValasztokerulet

  const oevk = getVkDetails({ id: selectedVk, election }) || {}

  const summary = settlements?.reduce((acc, s) => ({
    szk: acc.szk + (s.szk || 0),
    "választók száma": acc["választók száma"] + s["választók száma"],
    település: acc.település + 1
  }),{
    szk: 0,
    "választók száma": 0,
    település: 0
  })

  useEffect(() => {
    if (!oevk.leiras) return
    const query = [
      { $match: {
        "valasztokerulet.leiras": oevk.leiras,
      } },
      { $group: {
          _id: "$kozigEgyseg",
          szk: { $sum: 1 },
          "választók száma": { $sum: "$valasztokSzama" }
      } },  
      { $sort: { "_id.kozigEgysegNeve": 1 } },
      { $project: {
        település: "$_id.kozigEgysegNeve",
        "választók száma": 1,
        szk: 1,
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
          name: { $in: settlements.map(({ település }) => település.replace('.ker', '. kerület')) }
      }}
    ]

    zipService.aggregate({ query, path: '/settlements' })
    .then(({ data }) => setSettlementResult(data))

  }, [settlements])

  const { lg } = useBreakpoint()

  return (
    <>
      <PageHeaderStyled
        title="Választókerületek"
        breadcrumb={{ routes:   [{
          path: 'index',
          breadcrumbName: electionDescription || '...',
        }]}}
      />
      {showSearch && (
        <Item
        >
          <Select
            showSearch
            placeholder="Választókerület keresése"
            onSelect={setSelectedVk}
            options={allVks?.map(({ _id: value, leiras: label }) => ({ value, label }))}
            filterOption={optionFilter}
            notFoundContent={<div>Betöltés...</div>}
          />
        </Item>
      )}
      <Wrap horizontal={lg}>
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
        {settlements && (
          <ReactJson json={[...settlements, summary ]} />
        )}      
      </Wrap>
    </>
  )
}

export default OevkCities
