import React, { useState, /* useEffect */ } from 'react'
// import ReactJson from 'react-json-viewer'
import {
  // Form,
  PageHeader,
  // Select,
} from 'antd';
// import tszService from '../../services/tszService'
import MapBase from '../MapBase'
import styled from 'styled-components'
// import zipService from '../../services/zipService'
import Legend from '../Legend'
// import useValasztokerulet from '../../hooks/useValasztokerulet'
// import optionFilter from '../../functions/optionFilter'
import useValasztas from '../../hooks/useValasztas';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import allSettlements from './settlementsSimplified.json'

// const { Item } = Form

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


const AllSettlements = ({
  election = "ogy2018",
  // showSearch = true
}) => {
  // const [selectedVk, setSelectedVk] = useState()
  // const [settlements, setSettlements] = useState([])
  // const [settlementResult, setSettlementResult] = useState()

  const { leiras: electionDescription } = useValasztas({ election }) || {}

  // const geoJsonToPoly = geo => (
  //   geo?.coordinates[0].map(([lng, lat]) => ({ lng, lat }))    
  // )

  // const { getAllVks, getVkDetails } = useValasztokerulet

  // const oevk = getVkDetails({ id: selectedVk, election }) || {}

  // useEffect(() => {
  //   if (!oevk.leiras) return
  //   const query = `[
  //     { $match: {
  //       "valasztokerulet.leiras": "${oevk.leiras}",
  //     } },
  //     { $group: {
  //         _id: "$kozigEgyseg",
  //         szk: { $sum: 1 },
  //         valasztokSzama: { $sum: "$valasztokSzama" }
  //     } },  
  //     { $sort: { "_id.kozigEgysegNeve": 1 } },
  //     { $project: {
  //       település: "$_id.kozigEgysegNeve",
  //       valasztokSzama: 1,
  //       szk: 1,
  //       _id: 0,
  //       rank: 1      
  //     } }
  //   ]`
  //   tszService.aggregate({ query, election })
  //   .then(({ data }) => setSettlements(data))
  //   .catch(e => console.log(e))
  // },[oevk, election])

  // const allVks = getAllVks({ election })

  // const [lng, lat] = oevk?.korzethatar?.coordinates[0][0] || [19, 47]

  // useEffect(() => {
  //   if (!settlements?.length) {
  //     setSettlementResult(null)
  //     return
  //   }

  //   const s = settlements.map(({ település }) => település.replace('.ker', '. kerület'))

  //   const query = `[
  //     { $match: {
  //         name: { $in: ${JSON.stringify(s)}  }
  //     }}
  //   ]`

  //   zipService.aggregate({ query, path: '/settlements' })
  //   .then(({ data }) => setSettlementResult(data))

  // }, [settlements])

  const { lg } = useBreakpoint()

  // const summary = settlements?.reduce((acc, s) => ({
  //   szk: acc.szk + (s.szk || 0),
  //   "választók száma": acc["választók száma"] + s.valasztokSzama,
  //   település: acc.település + 1,
  // }),{
  //   szk: 0,
  //   "választók száma": 0,
  //   település: 0,
  // })

  // const viewData = [
  //   ...settlements.map(({ szk,valasztokSzama, település }) => ({
  //     szk,
  //     "választók száma": valasztokSzama,
  //     település
  //   })),
  //   summary
  // ]

  return (
    <>
      <PageHeaderStyled
        title="Magyarország települései"
        breadcrumb={{ routes:   [{
          path: 'index',
          breadcrumbName: electionDescription || '...',
        }]}}
      />
      {/* {showSearch && (
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
      )} */}
      <Wrap horizontal={lg}>
        {/* {oevk && ( */}
          <MapWrap>
            <MapBase
              center={{ lat: 47, lng: 19 }}
              zoom={7.5}
              mapId="85b71dbefa7b82fa"
            >
              {/* <MapBase.EvkPolygon
                unfilled
                paths={geoJsonToPoly(oevk?.korzethatar)}
              />  */}
              {allSettlements.features?.map?.(({ geometry }) => (
                <>
                  <MapBase.SzkPolygon
                    geometry={geometry}
                  />
                </>
              ))}
            </MapBase>
            {/* <Legend stroke="#FF3333AA" fill="#386FB300" text="OEVK határ" /> */}
            <Legend stroke="#386FB3CC" fill="#386FB355" text="Település-határok" />
          </MapWrap>
        {/* )} */}
        {/* {viewData && (
          <ReactJson json={viewData} />
        )}       */}
      </Wrap>
    </>
  )
}

export default AllSettlements
