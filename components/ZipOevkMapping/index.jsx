import React, { useState, useEffect, useContext } from 'react';
import ReactJson from 'react-json-viewer'
import {
  Input,
  Space,
} from 'antd';
import zipService from '../../services/zipService';

const validateQueryParams = ({ zip }) => {
  if (+zip > 9999 && +zip < 1000) {
    throw new Error
  }
}

const getQueryString = ({ zip }) => `[{ "$facet": {
  "result": [
    { "$match": { "zip": ${zip} } },
    { "$sort": { "zip": 1 } },
    { "$limit": 20 }
  ],
  "totalCount": [{ "$count": "totalCount" }]
}}]`

const mapResult = queryResult => {
  let [{ result, totalcount }] = queryResult || [{}]
  result = result?.map(({ zip, administrativeUnits }) => ({
    irsz: zip,
    település: administrativeUnits.map(({ name }) => name).join(', '),
  }))
  return { result, totalcount }
}

const ZipOevkMapping = () => {
  const [queryParams, setQueryParams] = useState({})
  const [queryResult, setQueryResult] = useState()

  useEffect(() => {
    let query
    try {
      validateQueryParams(queryParams)
      query = JSON.parse(getQueryString(queryParams))
    } catch(e){
      console.log(e)
      return
    }
    zipService.aggregate(query)
    .then(({ data }) => setQueryResult(data))
    .catch(e => console.log(e))

  }, [queryParams])

  const handleChange = ({ target: { name, value }}) => {
    setQueryParams({ ...queryParams, [name]: value })
  }

  const { result } = mapResult(queryResult)
  
  return (
    <>
      <h1>Irányítószámok szavazókörei</h1>
      <Input
        onChange={handleChange}
        name="zip"
        value={queryParams.zip}
      />
      <Space direction="vertical">    
        {result && <ReactJson json={result[0]} />}
      </Space> 
    </>
  )
}

export default ZipOevkMapping
