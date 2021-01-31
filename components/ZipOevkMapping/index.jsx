import React, { useState, useContext, useEffect } from 'react';
import {
  Form,
  Select,
  Button
} from 'antd';
import buffer from '@turf/buffer'
import { polygon } from '@turf/helpers'
import { DownloadOutlined } from '@ant-design/icons';
import ReactJson from 'react-json-viewer'
import zipService from '../../services/zipService';
import { AppContext } from '../../pages/_app'
import MapBase from '../MapBase';
import Legend from '../Legend';
import useValasztokerulet from '../../hooks/useValasztokerulet'
import styled from 'styled-components';

const { Item } = Form

const Wrapper = styled.div`
  * {
    margin-bottom: 4px;
  }
`

const areaFixes = (data, evkName) => {
  if (evkName?.includes('Budapest 11.')){
    return data.filter(({ irsz }) => ![1031, 1039, 2015].includes(irsz))
  }
  if (evkName?.includes('Budapest 17.')){
    return data.filter(({ irsz }) => ![1223].includes(irsz))
  }
  if (evkName?.includes('Pest megye 9.')){
    return data.filter(({ irsz }) => ![2768].includes(irsz))
  }
  if (evkName?.includes('Zala megye 2.')){
    return data.filter(({ irsz }) => ![8710].includes(irsz))
  }
  if (evkName?.includes('Zemplén megye 4.')){
    return data.filter(({ irsz }) => ![3847].includes(irsz))
  }

  if (evkName?.includes('Bereg megye 3.')){
    return [...data, { irsz: 4622, település: 'Komoró', zipPolygons: [] }]
  }


  return data
}

const ZipOevkMapping = () => {
  const [zipResult, setZipResult] = useState()
  const [selectedVk, setSelectedVk] = useState()
  const [downloadData, setDownloadData] = useState()

  console.log({selectedVk})

  const { election } = useContext(AppContext)

  const handleZipResult = result => {
    if (!result) return

    let z = result?.map?.(({ zip, administrativeUnits, polygon }) => {
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

    z = areaFixes(z, selectedVk)

    setZipResult(z)

    const d = {
      valasztokerulet: selectedVk,
      iranyitoszamok: z?.map(({ irsz, település }) => ({ irsz, nev: település }))
    }

    setDownloadData(encodeURIComponent(JSON.stringify(d, 0, 2)))
  }

  const { getAllVks, getVkDetails } = useValasztokerulet

  const allVks = getAllVks({ election })

  const { leiras, korzethatar } = getVkDetails({ id: selectedVk, election }) || {}

  let transformed
  
  if (korzethatar) {
    const contract = selectedVk.includes('Budapest') ? -150 : -500
    transformed = buffer(polygon(korzethatar.coordinates), contract, { units: 'meters' }).geometry
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

    zipService.aggregate({ query, path: '/zipcodes' })
    .then(({ data }) => handleZipResult(data))

  }, [korzethatar])

  const [lng = 19, lat = 47] = korzethatar?.coordinates[0][0] || []

  const filterFn = (input, option) => (
    option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
  )

  return (
    <Wrapper>
      <h1>OEVK irányítószám körzetei</h1>
      <Item
        label="Választókerület"
        >
        <Select
          showSearch
          placeholder="Választókerület"
          filterOption={filterFn}
          onSelect={setSelectedVk}
          options={allVks?.map(({ _id: value, leiras: label }) => ({ value, label }))}
        />
      </Item>
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
          <Button
            type="primary"
            href={`data:text/json;charset=utf-8,${downloadData}`}
            download={`${selectedVk}.json`}
            icon={<DownloadOutlined />}>
            Adatok letöltése
          </Button>
        </>
      )}
    </Wrapper>
  )
}

export default ZipOevkMapping
