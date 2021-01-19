import React, { useState, useContext, useEffect, useCallback } from 'react';
import {
  Input,
} from 'antd';
import ReactJson from 'react-json-viewer'
import zipService from '../../services/zipService';
import tszService from '../../services/tszService';
import { AppContext } from '../../pages/_app'
import MapBase from '../MapBase/ndex';
import Legend from '../Legend';
import useValasztokerulet from '../../hooks/useValasztokerulet';

const ZipOevkMapping = () => {
  const [inputValues, setInputValues] = useState({})
  const [zipResult, setZipResult] = useState()

  const { election } = useContext(AppContext)

  const handleZipResult = result => {
    if (!result) return

    const z = result?.map?.(({ zip, administrativeUnits, polygon }) => {
      let zipPolygons

      if (polygon?.type === 'Polygon'){
        zipPolygons = [polygon]
      } else if (polygon?.type === 'MultiPolygon'){
        zipPolygons = polygon.coordinates.map(coordinates => ({ coordinates }))
      }

      return {
        irsz: zip,
        település: administrativeUnits.map(({ name }) => name).join(', '),
        zipPolygons
      }
    })

    setZipResult(z)
  }

  const { leiras, korzethatar } = useValasztokerulet({ ...inputValues, election }) || {}

  useEffect(() => {
    const query = [
      {
        $match: {
          polygon: {
            $geoIntersects: {
              $geometry: korzethatar
            }
          }
        }
      }
    ]

    zipService.aggregate(query, '/zipcodes')
    .then(({ data }) => handleZipResult(data))

  }, [korzethatar])
  
  const handleChange = useCallback(({ target: { name, value }}) => {
    setInputValues({ ...inputValues, [name]: value })
  }, [inputValues, setInputValues])

  const [lng = 19, lat = 47] = korzethatar?.coordinates[0][0] || []



  return (
    <>
      <h1>OEVK irányítószám körzetei</h1>
      <h3>{leiras}</h3>
      <br /><br />
      <Input
        addonBefore="Választókerület neve"
        name="megye"
        onChange={handleChange}
        placeholder="Megye"
        value={inputValues.megye}
      />
      <Input
        addonBefore="Választókerület száma"
        name="oevkSzama"
        onChange={handleChange}
        placeholder="OEVK száma"
        value={inputValues.oevkSzama}
      />      
      
      {zipResult && (
        <>
          <MapBase
            center={{ lat, lng }}
            zoom={10}
          >
            <MapBase.SzkPolygon
              paths={korzethatar?.coordinates[0].map(([lng, lat]) => ({ lng, lat }))}
            />
            {zipResult?.map?.(({ zipPolygons }) => zipPolygons.map(zipPolygon =>
              <MapBase.ZipPolygon
                paths={zipPolygon.coordinates[0].map(([lng, lat]) => ({ lng, lat }))}
              />
            ))}
          </MapBase>
          <ReactJson json={zipResult.map(({ irsz, település }) => ({ irsz, település}))} />          
          <Legend stroke="#FF3333AA" fill="#386FB300" text="Irányítószámhoz tartozó körzet" />
          <Legend stroke="#386FB3CC" fill="#386FB355" text="OEVK körzete" />
        </>
      )}
    </>
  )
}

export default ZipOevkMapping
