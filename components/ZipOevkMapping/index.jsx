import React, { useState, useContext, useEffect } from 'react';
import {
  Form,
  Select,
  Button
} from 'antd';
import buffer from '@turf/buffer'
import { polygon } from '@turf/helpers'
import { DownloadOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import ReactJson from 'react-json-viewer'
import zipService from '../../services/zipService';
import { AppContext } from '../../pages/_app'
import MapBase from '../MapBase';
import Legend from '../Legend';
import useValasztokerulet from '../../hooks/useValasztokerulet'
import optionFilter from '../../functions/optionFilter'
import tszService from '../../services/tszService';
import sopronZipData from './sopronZipData.json'
import komoroZipData from './komoroZipdata.json'

const { Item } = Form

const Wrapper = styled.div`
  * {
    margin-bottom: 4px;
  }
`

const areaFixes = (data, evkName) => {
  const exclusions = [
    ['Budapest 11.',      [1031, 1039, 2015]  ],
    ['Budapest 17.',      [1223]              ],
    ['Budapest 10.',      [2015]              ],
  ]

  const inclusions = [
    ['Sopron megye 4.', [{ település:"Sopron", irsz: 9400, zipPolygons: [sopronZipData] }]],
    ['Bereg megye 3.',  [{ település:"Komoró", irsz: 4622, zipPolygons: [komoroZipData] }]],
  ]

  for (let [evkNameSubstr, zips] of exclusions) {
    if (evkName?.includes(evkNameSubstr)){
      return data?.filter(({ irsz }) => !zips.includes(irsz))
    }    
  }

  if (!data?.length) return data

  for (let [evkNameSubstr, inclData] of inclusions) {
    if (evkName?.includes(evkNameSubstr)){
      return [...data, ...inclData]
    }
  }

  return data
}

const reduceSettlements = data => (
  data.map(({ település }) => település.replace('.ker', '. kerület'))
)

const ZipOevkMapping = () => {
  const [zipResult, setZipResult] = useState()
  const [selectedVk, setSelectedVk] = useState()
  const [downloadData, setDownloadData] = useState()
  const [settlements, setSettlements] = useState()
  const [viewData, setViewData] = useState()
  const [transformed, setTransformed] = useState()

  const { election } = useContext(AppContext)

  const { getAllVks, getVkDetails } = useValasztokerulet

  const oevk = getVkDetails({ id: selectedVk, election }) || {}

  const { leiras, korzethatar } = oevk

  useEffect(() => {
    if (!zipResult) return

    let reducedZipResult = zipResult?.reduce?.((acc1, { zip, administrativeUnits, polygon }) => {
      let zipPolygons

      if (polygon?.type === 'Polygon'){
        zipPolygons = [polygon]
      } else if (polygon?.type === 'MultiPolygon'){
        zipPolygons = polygon.coordinates.map(coordinates => ({ coordinates }))
      }

      const telepulesek = administrativeUnits.filter(({ name }) => (
        settlements.includes(name))
      ).map(({ name }) => name)

      if (!telepulesek.length) return acc1

      return [...acc1, {
        irsz: zip,
        település: telepulesek.join(', '),
        zipPolygons
      }]
    }, [])

    reducedZipResult = areaFixes(reducedZipResult, leiras)

    setViewData(reducedZipResult)

    const d = {
      valasztokerulet: leiras,
      iranyitoszamok: reducedZipResult?.map(({ irsz, település }) => ({ irsz, nev: település })),
      korzethatar
    }

    setDownloadData(encodeURIComponent(JSON.stringify(d, 0, 2)))
  }, [zipResult, settlements, leiras])


  const allVks = getAllVks({ election })

  useEffect(() => {
    if (korzethatar) {
      const contract = leiras.includes('Budapest') ? -150 : -500
      let t = buffer(polygon(korzethatar.coordinates), contract, { units: 'meters' }).geometry
      setTransformed(t)
    }
  }, [korzethatar])  

  useEffect(() => {
    const query = `[
      {
        $match: {
          polygon: {
            $geoIntersects: {
              $geometry: ${JSON.stringify(transformed)}
            }
          }
        }
      }
    ]`

    zipService.aggregate({ query, path: '/zipcodes' })
    .then(({ data }) => setZipResult(data))

  }, [transformed])

  useEffect(() => {
    if (!oevk.leiras) return
    const query = `[
      { $match: {
        "valasztokerulet.leiras": "${oevk.leiras}",
      } },
      { $group: {
          _id: "$kozigEgyseg",
          szk: { $sum: 1 },
          valasztokSzama: { $sum: "$valasztokSzama" }
      } },  
      { $sort: { "_id.kozigEgysegNeve": 1 } },
      { $project: {
        település: "$_id.kozigEgysegNeve",
        valasztokSzama: 1,
        szk: 1,
        _id: 0,
        rank: 1      
      } }
    ]`
    tszService.aggregate({ query, election })
    .then(({ data }) => setSettlements(reduceSettlements(data)))
    .catch(e => console.log(e))
  },[oevk, election])  

  const [lng = 19, lat = 47] = korzethatar?.coordinates[0][0] || []

  return (
    <Wrapper>
      <h1>OEVK irányítószám körzetei</h1>
      <Item
        label="Választókerület"
        >
        <Select
          showSearch
          placeholder="Választókerület"
          filterOption={optionFilter}
          onSelect={setSelectedVk}
          options={allVks?.map(({ _id: value, leiras: label }) => ({ value, label }))}
        />
      </Item>
      <h3>{leiras}</h3>      
      {viewData && (
        <>
          <MapBase
            center={{ lat, lng }}
            zoom={10}
          >
            <MapBase.EvkPolygon
              paths={korzethatar?.coordinates[0].map(([lng, lat]) => ({ lng, lat }))}
            />
            {viewData?.map?.(({ zipPolygons }) => zipPolygons.map(zipPolygon =>
              <MapBase.ZipPolygon
                paths={zipPolygon.coordinates[0].map(([lng, lat]) => ({ lng, lat }))}
              />
            ))}
          </MapBase>
          <Legend stroke="#FF5555DD" fill="#FF444444" text="OEVK körzethatára" />
          <Legend stroke="#326B40" fill="#326B4000" text="Irányítószám körzet" />
          <ReactJson json={viewData.map(({ irsz, település }) => ({ irsz, település}))} />
          <Button
            type="primary"
            href={`data:text/json;charset=utf-8,${downloadData}`}
            download={`${leiras}.json`}
            icon={<DownloadOutlined />}>
            Adatok letöltése
          </Button>
        </>
      )}
    </Wrapper>
  )
}

export default ZipOevkMapping
