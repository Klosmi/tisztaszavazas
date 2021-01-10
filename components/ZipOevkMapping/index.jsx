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

  const options = {
    fillColor: "#386FB3",
    strokeColor: "#386FB3",
    fillOpacity: .3,
    strokeOpacity: .8,
    strokeWeight: 1,
    clickable: true,
    draggable: false,
    editable: false,
    geodesic: false,
    zIndex: 1
  }

  const zipPolyOptions = {
    fillColor: "#386FB3",
    strokeColor: "#FF3333",
    fillOpacity: 0,
    strokeOpacity: .8,
    strokeWeight: 2,
    clickable: false,
    draggable: false,
    editable: false,
    geodesic: false,
    zIndex: 1
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
          <MapBase.Polygon
            paths={korzethatar.coordinates[0].map(([lng, lat]) => ({ lng, lat }))}
            options={options}
          />
        ))}
        {zipPolygons?.map?.(zipPolygon => (
          <MapBase.Polygon
            paths={zipPolygon.coordinates[0].map(([lng, lat]) => ({ lng, lat }))}
            options={zipPolyOptions}
          />
        ))}
        </MapBase>)}
    </>
  )
}

export default ZipOevkMapping
