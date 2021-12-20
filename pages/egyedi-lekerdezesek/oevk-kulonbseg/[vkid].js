import { Select, Form, Drawer, Descriptions, Progress, Typography } from 'antd';
import ReactJson from 'react-json-viewer'
import styled from 'styled-components'
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { Polygon } from '@react-google-maps/api'
import centroid from '@turf/centroid'
import { useState } from 'react';

import TisztaszavazasLogo from '../../../components/TisztaszavazasLogo';
import MapBase from '../../../components/MapBase'
import ResponsiveLayout from '../../../components/ResponsiveLayout'
import tszService2 from '../../../services2/tszService2'
import zipService2 from '../../../services2/zipService2'
import Legend from '../../../components/Legend'
import If from '../../../components/If';

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

const Subtitle = styled(Typography.Text).attrs({ type: 'secondary'})`
  font-weight: normal;
  font-size: 14px;
`

const MapInner = styled.div`
  position: relative;
`

const BrandWrap = styled.div`
  background-color: #FFFFFFAA;
  width: 170px;
  height: 50px;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  bottom: 5px;
  right: 5px;
`

const TisztaszavazasLogoStyled = styled(TisztaszavazasLogo).attrs({ width: 140 })``

const DrawerFooter = styled.div`
  position: absolute;
  bottom: 10px;
`

const reduceSzavazatok = ([{ ellenzek, fidesz, osszes }]) => {
  const result = {}
  for (let { _id, szavazatok } of ellenzek){
    result[_id] = { ...(result[_id] || {}), ellenzek: szavazatok }
  }
  for (let { _id, szavazatok } of fidesz){
    result[_id] = { ...(result[_id] || {}), fidesz: szavazatok }
  }
  for (let { _id, szavazatok } of osszes){
    result[_id] = { ...(result[_id] || {}), osszes: szavazatok }
  }
  return result
}

const geoJsonToPoly = geo => (
  geo?.coordinates[0].map(([lng, lat]) => ({ lng, lat }))    
)

const getFilColor = ({ ellenzek, fidesz, osszes }) => {
  const threshold = [
    { from: -100, to: -20, color: '#EC9035' },
    { from: -20, to: -10, color: '#EDAC58' },
    { from: -10, to: 0,  color: '#F7C98E' },
    { from: 0, to: 10,   color: '#84CFE3' },
    { from: 10, to: 20,  color: '#5D93BE' },
    { from: 20, to: 100,  color: '#4858AE' },
  ]

  const ellenzekEredmeny = (ellenzek / osszes) * 100
  const fideszEredmeny = (fidesz / osszes) * 100
  const kulonbseg = Math.floor(ellenzekEredmeny - fideszEredmeny)

  for (const { from, to, color } of threshold){
    if (kulonbseg >= from && kulonbseg < to){
      return color
    }
  }
}

const OevkKulonbseg = ({
  pageError,
  vkList,
  oevk,
  vkId,
  tableData,
  mapData
}) => {
  if (pageError){
    return <div>{pageError}</div>
  }

  const isEmbedded = true // embedded === 'true'
  const hideTable = true // hide_table === 'true'
  const zoom = 9

  const vkOptions = (
    vkList
    ?.sort((a, b) => a.leiras < b.leiras ? -1 : 1)
    .map(({ _id: value, leiras: label }) => ({ value, label }))
  )

  const [activeSettlement, setActiveSettlement] = useState(null)

  const handleVkSelect = vkId => {
    router.push(vkId)
  }

  let lat = 47
  let lng = 19

  if (oevk){
    ;({ center: { geometry: { coordinates: [lng, lat] } }} = oevk)
  }

  const { lg } = useBreakpoint()

  const handleClickPolygon = (settlementId) => {
    const settlement = mapData.find(({ _id }) => _id === settlementId)  
    setActiveSettlement(settlement)
  }

  return (
    <ResponsiveLayout
      menu={false}
      isEmbedded={isEmbedded}
      >
      <If condition={!vkId}>
        <Form.Item>
          <Select
            value={vkId}
            showSearch
            placeholder="Választókerület keresése"
            onSelect={handleVkSelect}
            options={vkOptions}
            notFoundContent={<div>Betöltés...</div>}
          />
        </Form.Item>
      </If>

      <Wrap horizontal={lg}>
        {/* {oevk && szavazatok && ( */}
          <MapWrap>
            <MapInner>
              <MapBase
                mapId="85b71dbefa7b82fa"
                center={{ lat, lng }}
                zoom={+zoom}
              >
                <MapBase.EvkPolygon
                  unfilled
                  paths={geoJsonToPoly(oevk?.korzethatar)}
                />
                {mapData?.map?.(({
                  boundaries,
                  ellenzek,
                  fidesz,
                  osszes,
                  _id: settlementId
                }) => (
                  <>
                    <Polygon
                      onClick={() => handleClickPolygon(settlementId)}
                      paths={boundaries?.coordinates[0].map(([lng, lat]) => {
                        return ({ lng, lat })})}
                      options={{
                        fillColor: getFilColor({ ellenzek, fidesz, osszes }),
                        fillOpacity: .8,
                        ...(settlementId === activeSettlement?._id ? {
                          strokeOpacity: 1,
                          strokeColor: 'black',
                          strokeWeight: 3,
                        }: {
                          strokeOpacity: .5,
                          strokeColor: '#DDD',
                          strokeWeight: 1,
                        })
                      }}
                    />
                  </>
                ))}
              </MapBase>
              <BrandWrap>
                <TisztaszavazasLogoStyled />
              </BrandWrap>                
            </MapInner>
            <Legend stroke="#FF3333AA" fill="#386FB300" text="OEVK határ" />

            <Legend stroke="#386FB300" fill="#EC9035" text="Fidesz 20+%" />
            <Legend stroke="#386FB300" fill="#EDAC58" text="Fidesz 10+%" />
            <Legend stroke="#386FB300" fill="#F7C98E" text="Fidesz 0-10%" />
            <Legend stroke="#386FB300" fill="#84CFE3" text="Ellenzéki (MSZP-PM, JOBBIK, DK, MOMENTUM, LMP, EGYUTT) összesített eredmény 0-10%" />
            <Legend stroke="#386FB300" fill="#5D93BE" text="Ellenzéki eredmény 10+%" />
            <Legend stroke="#386FB300" fill="#4858AE" text="Ellenzéki eredmény 20+%" />
            {!isEmbedded && (
              <>
                <br />
                <strong>Beágyazáshoz:</strong>
                <textarea style={{ width: "100%" }} value={`<iframe src="https://app.tisztaszavazas.hu${asPath}?embedded=true&hide_table=true" width="100%" height="600" style="border: 0;"></iframe>`} />
              </>
            )}
          </MapWrap>
          <Drawer
            visible={!!activeSettlement}
            onClose={() => setActiveSettlement(null)}
            maskClosable={false}
            mask={false}
            >
              {activeSettlement && (
                <Descriptions column={1} title={
                  <>
                    <p>{activeSettlement.name}</p>
                    <Subtitle>{oevk.leiras}</Subtitle>
                  </>
                } layout="vertical">
                  <Descriptions.Item label="Ellenzék">
                    <strong>{activeSettlement.ellenzek}</strong> szavazat
                    <Progress
                      percent={Math.round(activeSettlement.ellenzek/activeSettlement.osszes*100, 2)}
                      size="small"
                      strokeColor="#4858AE"
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="Fidesz">
                    <strong>{activeSettlement.fidesz}</strong> szavazat
                    <Progress
                      percent={Math.round(activeSettlement.fidesz/activeSettlement.osszes*100, 2)}
                      size="small"
                      strokeColor="#EC9035"
                    />
                  </Descriptions.Item>                  
                </Descriptions>
              )}
              <DrawerFooter>
                <TisztaszavazasLogoStyled />
              </DrawerFooter>
          </Drawer>          
      </Wrap>



      {tableData && !hideTable && <ReactJson json={tableData} />}
    </ResponsiveLayout>
  )
}

export async function getStaticProps({ params: { vkid } }) {
  let vkList
  let pageError = null
  let settlements
  let mapData
  let partyAggregation
  let szavazatokTelepulesenkent
  let summary
  let tableData
  let oevk

  try {
    ;({ data: vkList } = await tszService2({
      path: 'valasztokeruletek',
      query: { limit: 200 },
      election: 'ogy2018'
    }))

    // vkList = vkList.slice(0, 3)

    if (vkid){
      oevk = vkList.find(({ _id }) => _id === vkid)
      oevk.center = centroid(oevk.korzethatar)

      const settlementsQuery = `[
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
  
      ;({ data: settlements } = await tszService2({
        election: 'ogy2018',
        path: 'szavazokorok',
        data: { query: settlementsQuery }
      }))

      const s = settlements.map(({ település }) => település.replace('.ker', '. kerület'))

      const mapDataQuery = `[
        { $match: {
          name: { $in: ${JSON.stringify(s)} }
        }}
      ]`

      ;({ data: mapData } = await zipService2({
        path: 'settlements',
        data: { query: mapDataQuery }
      }))
  
      const getQuery = partok => `[
        { $match: {
          ${partok ? `'jeloles.jelolo.szervezet.rovidNev': { $in: ${JSON.stringify(partok)} },` : ''}
          'jeloles.pozicio': "Egyéni választókerületi képviselő",
          'szavazokor.valasztokerulet.leiras': "${oevk.leiras}"
        } },
        { $group: {
          _id: "$szavazokor.kozigEgyseg.kozigEgysegNeve",
          szavazatok: { $sum: "$ervenyesSzavazat" }
        } }
      ]`

      const partyAggregationQuery = `[
        { $facet: {
          fidesz: ${getQuery(['FIDESZ'])},
          ellenzek: ${getQuery(['MSZP', 'JOBBIK', 'DK', 'MOMENTUM', 'LMP', 'EGYUTT'])},
          osszes: ${getQuery()}
        }},
      ]`

      ;({ data: partyAggregation } = await tszService2({
        election: 'ogy2018',
        path: 'szavazatok',
        data: { query: partyAggregationQuery }
      }))

      szavazatokTelepulesenkent = reduceSzavazatok(partyAggregation)

      summary = settlements?.reduce((acc, s) => ({
        szk: acc.szk + (s.szk || 0),
        "választók száma": acc["választók száma"] + s.valasztokSzama,
        település: acc.település + 1,
        fidesz: acc.fidesz + (szavazatokTelepulesenkent?.[s.település]?.fidesz || 0),
        ellenzék: acc.ellenzék + (szavazatokTelepulesenkent?.[s.település]?.ellenzek || 0),
        összes: acc.összes + (szavazatokTelepulesenkent?.[s.település]?.osszes || 0),
      }),{
        szk: 0,
        "választók száma": 0,
        település: 0,
        fidesz: 0,
        ellenzék: 0,
        összes: 0,
      })  

      tableData = [
        ...settlements.map(({ szk, valasztokSzama, település }) => ({
          szk,
          "választók száma": valasztokSzama,
          település,
          fidesz: szavazatokTelepulesenkent?.[település]?.fidesz || 0,
          ellenzék: szavazatokTelepulesenkent?.[település]?.ellenzek || 0,
          összes: szavazatokTelepulesenkent?.[település]?.osszes || 0,
        })),
        summary
      ]

      mapData = mapData.map(s => ({
        ...s,
        ...szavazatokTelepulesenkent[s.name.replace('. kerület', '.ker')]
      }))

    }
  } catch(error){
    console.log(error)
    pageError = error.message
  }


  
  return {
    props: {
      pageError,
      vkList,
      mapData,
      oevk,
      vkId: vkid,
      tableData,
    }
  }
}


export async function getStaticPaths() {
  let vkList

  ;({ data: vkList } = await tszService2({
    path: 'valasztokeruletek',
    query: { limit: 200 },
    election: 'ogy2018'
  }))

  // vkList = vkList.slice(0, 3)

  return {
    paths: vkList.map(({ _id }) => ({ params: { vkid: _id } }) ),
    fallback: false,
  }
}


export default OevkKulonbseg
