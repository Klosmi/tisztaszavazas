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
  * {
    margin: 6px 6px 0 0;
  }
`

const MapWrap = styled.div`
  width: 100%;
`

const PageHeaderStyled = styled(PageHeader)`
  padding: 16px 4px;
`

const OevkResult = ({
  election = "ogy2018",
  showSearch = true
}) => {
  const [selectedVk, setSelectedVk] = useState()
  const [settlements, setSettlements] = useState([])
  const [settlementResult, setSettlementResult] = useState()
  const [szavazatok, setSzavazatok] = useState()

  const { leiras: electionDescription } = useValasztas({ election }) || {}

  const geoJsonToPoly = geo => (
    geo?.coordinates[0].map(([lng, lat]) => ({ lng, lat }))    
  )

  const { getAllVks, getVkDetails } = useValasztokerulet

  const oevk = getVkDetails({ id: selectedVk, election }) || {}

  useEffect(() => {
    if (!oevk.leiras) return
    const query = [
      { $match: {
        "valasztokerulet.leiras": oevk.leiras,
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
    ]
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

    const query = [
      { $match: {
          name: { $in: settlements.map(({ település }) => település.replace('.ker', '. kerület')) }
      }}
    ]

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
    const getQuery = partok => ([
      { $match: {
        'jeloles.jelolo.szervezet.rovidNev': { $in: partok },
        'jeloles.pozicio': "Egyéni választókerületi képviselő",
        'szavazokor.valasztokerulet.leiras': oevk.leiras              
      } },
      { $group: {
        _id: "$szavazokor.kozigEgyseg.kozigEgysegNeve",
        szavazatok: { $sum: "$ervenyesSzavazat" }
      } }
    ])

    tszService.getVotes({
      election,
      query: [
        { $facet: {
          fidesz: [
            ...getQuery(['FIDESZ']),
          ],
          ellenzek: [
            ...getQuery(['MSZP', 'JOBBIK', 'DK', 'MOMENTUM', 'LMP']),    
          ]
        }},
      ]
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

  console.log({szavazatok})

  const getFilColor = ({ name }) => {
    if (!szavazatok?.[name]?.ellenzek || !szavazatok?.[name]?.fidesz) return 'lightgray'
    return szavazatok?.[name]?.ellenzek > szavazatok?.[name]?.fidesz ? 'lightblue' : 'orange'
  }

  return (
    <>
      <PageHeaderStyled
        title="2022-es eredménybecslés a 2018-as választási eredmények alapján"
        breadcrumb={{ routes:   [{
          path: 'index',
          breadcrumbName: electionDescription || '...',
        }]}}
      />
      {showSearch && (
        <Item
        >
          <Select
            showSearch
            placeholder="Választókerület keresése"
            onSelect={setSelectedVk}
            options={allVks?.map(({ _id: value, leiras: label }) => ({ value, label }))}
            filterOption={optionFilter}
            notFoundContent={<div>Betöltés...</div>}
          />
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
                    paths={settlement?.boundaries?.coordinates[0].map(([lng, lat]) => ({ lng, lat }))}
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
            <Legend stroke="#386FB300" fill="lightblue" text="Ellenzéki ('MSZP-PM', 'JOBBIK', 'DK', 'MOMENTUM', 'LMP') összesített eredmény magasabb" />
          </MapWrap>
        )}
        {viewData && (
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
