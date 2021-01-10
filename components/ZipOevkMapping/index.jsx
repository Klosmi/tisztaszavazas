import React, { useState } from 'react';
import {
  Input,
} from 'antd';
import ZipQuery from '../ZipQuery';
import ReactJson from 'react-json-viewer'


const isParamValid = ({ name, value }) => {
  if (name === 'zip'){
    return (+value <= 9999 && +value > 1000)
  }
}

const ZipOevkMapping = () => {
  const [inputValues, setInputValues] = useState({})
  const [queryParams, setQueryParams] = useState({})
  const [zipResult, setZipResult] = useState()

  const handleChange = ({ target: { name, value }}) => {
    setInputValues({ ...inputValues, [name]: value })

    if (isParamValid({ name, value })) {
      setQueryParams({ ...queryParams, [name]: value })
    }
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
        value={inputValues.zip}
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
