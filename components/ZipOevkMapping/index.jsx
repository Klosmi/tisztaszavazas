import React, { useState } from 'react';
import {
  Input,
} from 'antd';
import ZipQuery from '../ZipQuery';
import ReactJson from 'react-json-viewer'


const validateQueryParams = ({ zip }) => {
  return (+zip <= 9999 && +zip > 1000)
}


const ZipOevkMapping = () => {
  const [queryParams, setQueryParams] = useState({})
  const [zipResult, setZipResult] = useState()

  const handleChange = ({ target: { name, value }}) => {
    setQueryParams({ ...queryParams, [name]: value })
  }

  const handleZipResult = ([{ zip, administrativeUnits }]) => {
    setZipResult({
      irsz: zip,
      település: administrativeUnits.map(({ name }) => name).join(', '),
    })
  }

  return (
    <>
      <h1>Irányítószámok szavazókörei</h1>
      <Input
        onChange={handleChange}
        name="zip"
        value={queryParams.zip}
      />
      <ZipQuery
        queryString={`[{ "$match": { "zip": ${queryParams.zip} } }]`}
        onResult={handleZipResult}
      />
      <ReactJson json={zipResult} />
    </>
  )
}

export default ZipOevkMapping
