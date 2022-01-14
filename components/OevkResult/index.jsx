import React, { useState, useEffect } from 'react'
import ReactJson from 'react-json-viewer'
import {
  Form,
  PageHeader,
  Select,
} from 'antd';
import { Polygon } from '@react-google-maps/api'
import tszService from '../../services/tszService'
import MapBase from '../MapBase'
import styled from 'styled-components'
import zipService from '../../services/zipService'
import Legend from '../Legend'
import useValasztokerulet from '../../hooks/useValasztokerulet'
import optionFilter from '../../functions/optionFilter'
import useValasztas from '../../hooks/useValasztas';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';

const { Item } = Form

const Wrap = styled.div`
  display: flex;
  flex-direction: ${({ horizontal }) => horizontal ? 'row' : 'column' };
`

const MapWrap = styled.div`
  width: 100%;
`

const PageHeaderStyled = styled(PageHeader)`
  padding: 16px 4px;
`

const OevkResult = ({
  election = "ogy2018",
  showSearch = true,
  isEmbedded,
  initialVkId,
  hideTable,
  pathName,
}) => {
  const [selectedVk, setSelectedVk] = useState()
  const [settlements, setSettlements] = useState([])
  const [settlementResult, setSettlementResult] = useState()
  const [szavazatok, setSzavazatok] = useState()

  useEffect(() => {
    if (initialVkId) setSelectedVk(initialVkId)
  }, [initialVkId])

  const { leiras: electionDescription } = useValasztas({ election }) || {}

  const geoJsonToPoly = geo => (
    geo?.coordinates[0].map(([lng, lat]) => ({ lng, lat }))    
  )

  const { getAllVks, getVkDetails } = useValasztokerulet

  const oevk = getVkDetails({ id: selectedVk, election }) || {}

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
    .then(({ data }) => setSettlements(data))
    .catch(e => console.log(e))
  },[oevk, election])

  const allVks = getAllVks({ election })

  const [lng, lat] = oevk?.korzethatar?.coordinates[0][0] || [19, 47]

  useEffect(() => {
    if (!settlements?.length) {
      setSettlementResult(null)
      return
    }

    const s = settlements.map(({ település }) => település.replace('.ker', '. kerület'))

    const query = `[
      { $match: {
        name: { $in: ${JSON.stringify(s)} }
      }}
    ]`

    zipService.aggregate({ query, path: '/settlements' })
    .then(({ data }) => setSettlementResult(data))

  }, [settlements])

  useEffect(() => {
    const reduce = ([{ ellenzek, fidesz }]) => {
      const result = {}
      for (let { _id, szavazatok } of ellenzek){
        result[_id] = { ellenzek: szavazatok }
      }
      for (let { _id, szavazatok } of fidesz){
        if (result[_id]) result[_id].fidesz = szavazatok
        else result[_id] = { fidesz: szavazatok }
      }
      return result
    }

    if (!oevk.leiras) return

    const getQuery = partok => `[
      { $match: {
        'jeloles.jelolo.szervezet.rovidNev': { $in: ${JSON.stringify(partok)} },
        'jeloles.pozicio': "Egyéni választókerületi képviselő",
        'szavazokor.valasztokerulet.leiras': "${oevk.leiras}"
      } },
      { $group: {
        _id: "$szavazokor.kozigEgyseg.kozigEgysegNeve",
        szavazatok: { $sum: "$ervenyesSzavazat" }
      } }
    ]`

    tszService.getVotes({
      election,
      query: `[
        { $facet: {
          fidesz: ${getQuery(['FIDESZ'])},
          ellenzek: ${getQuery(['MSZP', 'JOBBIK', 'DK', 'MOMENTUM', 'LMP', 'EGYUTT'])}
        }},
      ]`
    })
    .then(data => setSzavazatok(reduce(data)))
  }, [oevk, election])

  const { lg } = useBreakpoint()

  const summary = settlements?.reduce((acc, s) => ({
    szk: acc.szk + (s.szk || 0),
    "választók száma": acc["választók száma"] + s.valasztokSzama,
    település: acc.település + 1,
    fidesz: acc.fidesz + (szavazatok?.[s.település]?.fidesz || 0),
    ellenzék: acc.ellenzék + (szavazatok?.[s.település]?.ellenzek || 0),
  }),{
    szk: 0,
    "választók száma": 0,
    település: 0,
    fidesz: 0,
    ellenzék: 0
  })

  const viewData = [
    ...settlements.map(({ szk,valasztokSzama, település }) => ({
      szk,
      "választók száma": valasztokSzama,
      település,
      fidesz: szavazatok?.[település]?.fidesz || 0,
      ellenzék: szavazatok?.[település]?.ellenzek || 0
    })),
    summary
  ]

  const getFilColor = ({ name }) => {
    const threshold = [
      { from: -100, to: -10, color: '#EC9035' },
      { from: -10, to: -5, color: '#EDAC58' },
      { from: -5, to: 0,  color: '#F7C98E' },
      { from: 0, to: 5,   color: '#84CFE3' },
      { from: 5, to: 10,  color: '#5D93BE' },
      { from: 10, to: 100,  color: '#4858AE' },
    ]

    const { fidesz, ellenzek } = szavazatok?.[name] || {}
    const ossz = fidesz + ellenzek
    const kulonbseg = ellenzek - fidesz
    const kulonbsegSzazalek = ossz / kulonbseg

    for (const { from, to, color } of threshold){
      if (kulonbsegSzazalek > from && kulonbsegSzazalek <= to) {
        if (name === 'Öttömös') {
          console.log(name, from, to, color, kulonbsegSzazalek, szavazatok?.[name])
        }
        return color
      }
    }
    

    //if (!szavazatok?.[name]?.ellenzek || !szavazatok?.[name]?.fidesz) return 'lightgray'
    // return szavazatok?.[name]?.ellenzek > szavazatok?.[name]?.fidesz ? 'lightblue' : 'orange'
  }

  return (
    <>
    {!isEmbedded && (
      <PageHeaderStyled
        title="2022-es eredménybecslés a 2018-as választási eredmények alapján"
        breadcrumb={{ routes:   [{
          path: 'index',
          breadcrumbName: electionDescription || '...',
        }]}}
      />
      )}
      {showSearch && !isEmbedded && (
        <Item
        >
          {!initialVkId && (
            <Select
              value={selectedVk}
              showSearch
              placeholder="Választókerület keresése"
              onSelect={setSelectedVk}
              options={allVks?.map(({ _id: value, leiras: label }) => ({ value, label }))}
              filterOption={optionFilter}
              notFoundContent={<div>Betöltés...</div>}
            />
          )}
        </Item>
      )}
      <Wrap horizontal={lg}>
        {oevk && szavazatok && (
          <MapWrap>
            <MapBase
              center={{ lat, lng }}
              zoom={9}
            >
              <MapBase.EvkPolygon
                unfilled
                paths={geoJsonToPoly(oevk?.korzethatar)}
              />          
              {settlementResult?.map?.(settlement => (
                <>
                  <Polygon
                    paths={settlement?.boundaries?.coordinates[0].map(([lng, lat]) => {
                      return ({ lng, lat })})
                    }
                    options={{
                      fillColor: getFilColor(settlement),
                      strokeOpacity: .5,
                      strokeColor: 'gray',
                      strokeWeight: 1,
                      fillOpacity: .8,
                    }}
                  />
                </>
              ))}
            </MapBase>
            <Legend stroke="#FF3333AA" fill="#386FB300" text="OEVK határ" />
            <Legend stroke="#386FB300" fill="orange" text="Fidesz eredmény magasabb" />
            <Legend stroke="#386FB300" fill="lightblue" text="Ellenzéki (MSZP-PM, JOBBIK, DK, MOMENTUM, LMP) összesített eredmény magasabb" />
            {/* TODO: ennek a parentben lenne a helye */}
            {!isEmbedded && (
              <>
                <br />
                <strong>Beágyazáshoz:</strong>
                <textarea style={{ width: "100%" }} value={`<iframe src="https://app.tisztaszavazas.hu${pathName}?embedded=true&vk_id=${selectedVk}&hide_table=true" width="100%" height="600" style="border: 0;"></iframe>`} />
              </>
            )}
          </MapWrap>
        )}
        {viewData && !hideTable && (
          <div>
            <h4>Egyéni választókerületi eredmények</h4>
            <ReactJson json={viewData} />
          </div>
        )}      
      </Wrap>
    </>
  )
}

export default OevkResult
