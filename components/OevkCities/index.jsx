import React, { useState, useEffect } from 'react';
import ReactJson from 'react-json-viewer'
import {
  Input,
} from 'antd';
import tszService from '../../services/tszService';
import MapBase from '../MapBase';
import styled from 'styled-components';
import zipService from '../../services/zipService';
import Legend from '../Legend';
import useValasztokerulet from '../../hooks/useValasztokerulet';

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
  megye = 'Nógrád',
  oevkSzama = 1,
  election = "ogy2018",
  showSearch = true
}) => {
  const [queryParams, setQueryParams] = useState({
    megye,
    oevkSzama
  })
  const [queryResult, setQueryResult] = useState()
  const [settlementResult, setSettlementResult] = useState()

  const onChange = ({ target: { name, value }}) => {
    setQueryParams({ ...queryParams, [name]: value })
  }

  const geoJsonToPoly = geo => (
    geo?.coordinates[0].map(([lng, lat]) => ({ lng, lat }))    
  )

  const summary = queryResult?.reduce((acc, { szavazokorDarab, valasztokSzama }) => ({
    szavazokorDarab: acc.szavazokorDarab + (szavazokorDarab || 0),
    valasztokSzama: acc.valasztokSzama + valasztokSzama,
    kozigEgysegNeve: acc.kozigEgysegNeve + 1
  }),{
    szavazokorDarab: 0,
    valasztokSzama: 0,
    kozigEgysegNeve: 0
  })

  useEffect(() => {
    if (!queryParams.oevkSzama || queryParams.megye?.length < 4) return
    const query = [
      { $match: {
        "valasztokerulet.leiras": { $regex: queryParams.megye },
        "valasztokerulet.szam": +queryParams.oevkSzama
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
    .then(({ data }) => setQueryResult(data))
    .catch(e => console.log(e))
  },[queryParams, election])


  const oevk = useValasztokerulet({ ...queryParams, election })

  const [lng, lat] = oevk?.korzethatar.coordinates[0][0] || []

  useEffect(() => {
    if (!queryResult?.length) {
      setSettlementResult(null)
      return
    }

    const query = [
      { $match: {
          name: { $in: queryResult.map(({ kozigEgysegNeve }) => kozigEgysegNeve.replace('.ker', '. kerület')) }
      }}
    ]

    zipService.aggregate({ query, path: '/settlements' })
    .then(({ data }) => setSettlementResult(data))

  }, [queryResult])

  return (
    <>
      <h1>{oevk?.leiras || 'OEVK'} települései</h1>
      {showSearch && (
        <>
          <Input
            addonBefore="Megye neve"
            name="megye"
            onChange={onChange}
            placeholder="Megye"
            value={queryParams.megye}
          />
          <Input
            addonBefore="Választókerület száma"
            name="oevkSzama"
            onChange={onChange}
            placeholder="OEVK száma"
            value={queryParams.oevkSzama}
          />
        </>
      )}
      <Wrap>
      {queryResult && (
        <ReactJson json={[...queryResult, summary ]} />
      )}
      {oevk && (
        <MapWrap>
          <MapBase
            center={{ lat, lng }}
            zoom={10}
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
