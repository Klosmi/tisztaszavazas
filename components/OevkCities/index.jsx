import React, { useState, useContext, useEffect } from 'react';
import ReactJson from 'react-json-viewer'
import {
  Input,
} from 'antd';
import { AppContext } from '../Layout';
import tszService from '../../services/tszService';
import MapBase from '../MapBase/ndex';
import styled from 'styled-components';
import zipService from '../../services/zipService';

const Wrap = styled.div`
  display: flex;
  * {
    margin: 6px 6px 0 0;
  }
`

const OevkCities = () => {
  const [queryParams, setQueryParams] = useState({
    megye: 'Borsod',
    oevkSzama: 6
  })
  const [queryResult, setQueryResult] = useState()
  const [szkResult, setSzkResult] = useState()
  const [oevkPolygon, setOevkPolygon] = useState()
  const [settlementResult, setSettlementResult] = useState()
  const { election } = useContext(AppContext)

  const onChange = ({ target: { name, value }}) => {
    setQueryParams({ ...queryParams, [name]: value })
  }

  const [lng, lat] = szkResult?.[0]?.korzethatar.coordinates[0][0] || []

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

  const handleSettlementResult = ({ data }) => {
    const settlements = Object.values(data[0]).map(([settlement]) => settlement)
    setSettlementResult(settlements)
  }

  useEffect(() => {
    if (!queryParams.oevkSzama || !queryParams.megye) return
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
    tszService.aggregate(query, election)
    .then(({ data }) => setQueryResult(data))
    .catch(e => console.log(e))
  },[queryParams, election])

  useEffect(() => {
    if (!queryParams.oevkSzama || !queryParams.megye) return
    const query = [
      { $match: {
        "valasztokerulet.leiras": { $regex: queryParams.megye },
        "valasztokerulet.szam": +queryParams.oevkSzama
      } },
      { $project: {
        korzethatar: 1,
        valasztokSzama: 1
      } }
    ]
    tszService.aggregate(query, election)
    .then(({ data }) => setSzkResult(data))
    .catch(e => console.log(e))
  }, [queryParams, election])

  useEffect(() => {
    if (!queryParams.oevkSzama || !queryParams.megye) return
    const query = [
      { $match: {
        leiras: { $regex: queryParams.megye },
        szam: +queryParams.oevkSzama
      } }
    ]
    tszService.aggregate(query, election, '/valasztokeruletek')
    .then(({ data }) => setOevkPolygon(data[0]?.korzethatar))
  }, [queryParams, election])

  useEffect(() => {
    if (!queryResult?.length) {
      setSettlementResult(null)
      return
    }
    const query = [{ $facet: 
      queryResult.reduce((acc, { kozigEgysegNeve }, i) => ({
        ...acc,
        [i]: [{ $match: { name: kozigEgysegNeve } }, { $project: { name: 1, boundaries: 1 }}]
      }), {})
    }]

    zipService.aggregate(query, '/settlements')
    .then(handleSettlementResult)

  }, [queryResult])

  return (
    <>
      <h1>OEVK települései</h1>
      <Input
        addonBefore="Választókerület neve"
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
      <Wrap>
      {queryResult && (
        <ReactJson json={[...queryResult, summary ]} />
      )}
      {szkResult && (
        <MapBase
          center={{ lat, lng }}
          zoom={10}
        >
          {settlementResult?.map?.(settlement => (
            <>
              <MapBase.SzkPolygon
                paths={settlement?.boundaries?.coordinates[0].map(([lng, lat]) => ({ lng, lat }))}
              />
            </>
          ))}
          <MapBase.ZipPolygon
            paths={geoJsonToPoly(oevkPolygon)}
          />
        </MapBase>
      )}
      </Wrap>
    </>
  )
}

export default OevkCities
