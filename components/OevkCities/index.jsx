import React, { useState, useEffect } from 'react';
import ReactJson from 'react-json-viewer'
import {
  Input,
  Button,
  Space,
} from 'antd';
import styled from 'styled-components';

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

export default ({ onQuery, queryResult }) => {
  const [queryParams, setQueryParams] = useState({
    megye: 'Borsod',
    oevkSzama: 6
  })

  const handleQuerySendClick = () => {
    const query = getQueryString(queryParams)
    onQuery(JSON.parse(query))
  }

  const onChange = ({ target: { name, value }}) => {
    setQueryParams({ ...queryParams, [name]: value })
  }

  return (
    <>
      <Space direction="vertical">
        <Input
          addonBefore="Választókerület teljes neve"
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
        <Button onClick={handleQuerySendClick}>Keresés</Button>
        <ReactJson json={queryResult} />
      </Space>
    </>
  )
}