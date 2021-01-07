import React, { useState, useEffect, useContext } from 'react';
import ReactJson from 'react-json-viewer'
import {
  Input,
  Space,
} from 'antd';
import styled from 'styled-components';
import { AppContext } from '../Layout';
import tszService from '../../services/tszService';

const Flex = styled.div`
  display: flex;
`

const getQueryString = ({ megye, oevkSzama }) => `
  [
    { "$match": {
      "valasztokerulet.leiras": { "$regex": "${megye}" },
      "valasztokerulet.szam": ${oevkSzama}
    } },
    { "$group": {
        "_id": "$kozigEgyseg",
        "szavazokorDarab": { "$sum": 1 },
        "valasztokSzama": { "$sum": "$valasztokSzama" }
    } },  
    { "$sort": { "_id.kozigEgysegNeve": 1 } },
    { "$project": {
      "kozigEgysegNeve": "$_id.kozigEgysegNeve",
      "valasztokSzama": 1,
      "szavazokorDarab": 1,
      "_id": 0,
      "rank": 1      
    } }
  ]
`

const OevkCities = () => {
  const [queryParams, setQueryParams] = useState({
    megye: 'Borsod',
    oevkSzama: 6
  })
  const [queryResult, setQueryResult] = useState()
  const { election } = useContext(AppContext)

  useEffect(() => {
    let query
    try {
      query = JSON.parse(getQueryString(queryParams))
    } catch(e){
      return
    }
    tszService.aggregate(query, election)
    .then(({ data }) => setQueryResult(data))
    .catch(e => console.log(e))

  }, [queryParams])

  const onChange = ({ target: { name, value }}) => {
    setQueryParams({ ...queryParams, [name]: value })
  }

  return (
    <>
      <Space direction="vertical">
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
        {queryResult && <ReactJson json={queryResult} />}
      </Space>
    </>
  )
}

export default OevkCities
