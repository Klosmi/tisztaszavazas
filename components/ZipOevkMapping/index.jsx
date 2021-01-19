import React, { useState, useContext, useEffect } from 'react';
import {
  Input,
} from 'antd';
import ReactJson from 'react-json-viewer'
import zipService from '../../services/zipService';
import tszService from '../../services/tszService';
import { AppContext } from '../../pages/_app'
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
  const [oevkResult, setOevkResult] = useState([])

  const { election } = useContext(AppContext)

  const handleZipResult = ([{ zip, administrativeUnits, polygon }]) => {
    setZipResult({
      irsz: zip,
      település: administrativeUnits.map(({ name }) => name).join(', '),
      polygon
    })
  }

  useEffect(() => {
    if (!queryParams.zip) return
    const query = [
      { $match: { zip: + queryParams.zip } }
    ]
    
    zipService.aggregate(query)
    .then(({ data }) => handleZipResult(data))
    .catch(e => console.log(e))
  },[queryParams, election])  

  useEffect(() => {
    if (!zipResult.polygon) return

    const query = [
      {
        $match: {
          korzethatar: {
            $geoIntersects: {
              $geometry: zipResult.polygon
            }
          }
        }
      }
    ]
    
    tszService.aggregate(query, election, '/valasztokeruletek')
    .then(({ data }) => setOevkResult(data))
    .catch(e => console.log(e))
  },[zipResult, election])    

  const handleChange = ({ target: { name, value }}) => {
    setInputValues({ ...inputValues, [name]: value })

    if (isParamValid({ name, value })) {
      setQueryParams({ ...queryParams, [name]: value })
    }
  }

  const [lng = 19, lat = 47] = zipResult?.polygon?.coordinates[0][0] || []

  let zipPolygons

  if (zipResult.polygon?.type === 'Polygon'){
    zipPolygons = [zipResult.polygon]
  } else if (zipResult.polygon?.type === 'MultiPolygon'){
    zipPolygons = zipResult.polygon.coordinates.map(coordinates => ({ coordinates }))
  }

  return (
    <>
      <h1>Irányítószámhoz tartozó OEVK</h1>
      <Input
        onChange={handleChange}
        name="zip"
        value={inputValues.zip}
      />
      <ReactJson json={{ irsz: zipResult.irsz, település: zipResult.település }} />
      {zipResult && (
        <>
          <MapBase
            center={{ lat, lng }}
            zoom={10}
          >
            {oevkResult?.map?.(({ korzethatar }) => (
              <MapBase.SzkPolygon
                paths={korzethatar.coordinates[0].map(([lng, lat]) => ({ lng, lat }))}
              />
            ))}
            {zipPolygons?.map?.(zipPolygon => (
              <MapBase.ZipPolygon
                paths={zipPolygon.coordinates[0].map(([lng, lat]) => ({ lng, lat }))}
              />
            ))}
          </MapBase>
          <Legend stroke="#FF3333AA" fill="#386FB300" text="Irányítószámhoz tartozó körzet" />
          <Legend stroke="#386FB3CC" fill="#386FB355" text="OEVK körzete" />
          </>
        )}
    </>
  )
}

export default ZipOevkMapping
