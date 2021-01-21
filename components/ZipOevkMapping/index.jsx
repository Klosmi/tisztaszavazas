import React, { useState, useContext, useEffect, useCallback } from 'react';
import {
  Input,
} from 'antd';
import buffer from '@turf/buffer'
import { polygon } from '@turf/helpers'
import ReactJson from 'react-json-viewer'
import zipService from '../../services/zipService';
import { AppContext } from '../../pages/_app'
import MapBase from '../MapBase';
import Legend from '../Legend';
import useValasztokerulet from '../../hooks/useValasztokerulet'
import styled from 'styled-components';

const Wrapper = styled.div`
  * {
    margin-bottom: 4px;
  }
`

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

  let transformed
  
  if (korzethatar) {
    transformed = buffer(polygon(korzethatar.coordinates), -500, { units: 'meters' }).geometry
  }

  useEffect(() => {
    const query = [
      {
        $match: {
          polygon: {
            $geoIntersects: {
              $geometry: transformed
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
    <Wrapper>
      <h1>OEVK irányítószám körzetei</h1>
      <Input
        addonBefore="Megye neve"
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
      <h3>{leiras}</h3>      
      {zipResult && (
        <>
          <MapBase
            center={{ lat, lng }}
            zoom={10}
          >
            <MapBase.EvkPolygon
              paths={korzethatar?.coordinates[0].map(([lng, lat]) => ({ lng, lat }))}
            />
            {zipResult?.map?.(({ zipPolygons }) => zipPolygons.map(zipPolygon =>
              <MapBase.ZipPolygon
                paths={zipPolygon.coordinates[0].map(([lng, lat]) => ({ lng, lat }))}
              />
            ))}
          </MapBase>
          <Legend stroke="#FF5555DD" fill="#FF444444" text="OEVK körzethatára" />
          <Legend stroke="#326B40" fill="#326B4000" text="Irányítószám körzet" />
          <ReactJson json={zipResult.map(({ irsz, település }) => ({ irsz, település}))} />
        </>
      )}
    </Wrapper>
  )
}

export default ZipOevkMapping
