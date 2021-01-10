import React, { useState, useContext } from 'react';
import {
  Input,
} from 'antd';
import QueryApi from '../QueryApi';
import ReactJson from 'react-json-viewer'
import zipService from '../../services/zipService';
import tszService from '../../services/tszService';
import { AppContext } from '../Layout';
import MapBase from '../MapBase/ndex';
import Legend from '../Legend';

const isParamValid = ({ name, value }) => {
  if (name === 'zip'){
    return (+value <= 9999 && +value > 1000)
  }
}

const ZipOevkMapping = () => {
  const [inputValues, setInputValues] = useState({})
  const [queryParams, setQueryParams] = useState({})
  const [zipResult, setZipResult] = useState({})
  const [szkResult, setSzkResult] = useState([])

  const { election } = useContext(AppContext)

  const handleChange = ({ target: { name, value }}) => {
    setInputValues({ ...inputValues, [name]: value })

    if (isParamValid({ name, value })) {
      setQueryParams({ ...queryParams, [name]: value })
    }
  }

  const handleZipResult = ([{ zip, administrativeUnits, polygon }]) => {
    setZipResult({
      irsz: zip,
      település: administrativeUnits.map(({ name }) => name).join(', '),
      polygon
    })
  }

  const handleSzkResult = res  => {
    setSzkResult(res)
  }

  const [lng, lat] = szkResult?.[0]?.korzethatar.coordinates[0][0] || []

  let zipPolygons

  if (zipResult.polygon?.type === 'Polygon'){
    zipPolygons = [zipResult.polygon]
  } else if (zipResult.polygon?.type === 'MultiPolygon'){
    zipPolygons = zipResult.polygon.coordinates.map(coordinates => ({ coordinates }))
  }

  return (
    <>
      <h1>Irányítószámok szavazókörei</h1>
      <Input
        onChange={handleChange}
        name="zip"
        value={inputValues.zip}
      />
      <QueryApi
        promise={zipService.aggregate}
        queryString={`[{ "$match": { "zip": ${queryParams.zip} } }]`}
        onResult={handleZipResult}
      />
      {zipResult.polygon && (<QueryApi
        promise={q => tszService.aggregate(q, election)}
        queryString={`[
          {   "$project": { "valasztokerulet": 1, "korzethatar": 1, "kozigEgyseg": 1, "szavazokorSzama": 1 } },
          {
              "$match": {
                  "korzethatar": {
                      "$geoIntersects": {
                          "$geometry": ${JSON.stringify(zipResult.polygon)}
                      }
                  }
              }
          }
      ]`}
        onResult={handleSzkResult}
      />
      )}
      <ReactJson json={{ irsz: zipResult.irsz, település: zipResult.település }} />
      {szkResult && (
        <MapBase
          center={{ lat, lng }}
        >
          {szkResult.map(({ korzethatar }) => (
            <MapBase.SzkPolygon
              paths={korzethatar.coordinates[0].map(([lng, lat]) => ({ lng, lat }))}
            />
          ))}
          {zipPolygons?.map?.(zipPolygon => (
            <MapBase.ZipPolygon
              paths={zipPolygon.coordinates[0].map(([lng, lat]) => ({ lng, lat }))}
            />
          ))}
        </MapBase>)}
        <Legend stroke="#FF3333AA" fill="#386FB300" text="Irányítószámhoz tartozó körzet" />
        <Legend stroke="#386FB3CC" fill="#386FB355" text="Szavazókör körzete" />
    </>
  )
}

export default ZipOevkMapping
