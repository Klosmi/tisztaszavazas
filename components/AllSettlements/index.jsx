import React, { useState, useReducer } from 'react'
import {
  Drawer,
  PageHeader,
  Descriptions,
} from 'antd';
import MapBase from '../MapBase'
import styled from 'styled-components'
import Legend from '../Legend'
import useValasztas from '../../hooks/useValasztas';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import TisztaszavazasLogo from '../TisztaszavazasLogo';
import reducer, { initialState } from './reducer';

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

const TisztaszavazasLogoStyled = styled(TisztaszavazasLogo).attrs({ width: 140 })``

const DrawerFooter = styled.div`
  position: absolute;
  bottom: 10px;
`

const getFillColor = ({
  numberOfVoters,
  isCountrySelected
}) => {
  const baseColor = isCountrySelected ? `#FF0000` : `#28457B`

  const threshold = [
    { from: 0,      to: 1000,   color: `${baseColor}40` },
    { from: 1000,   to: 2000,   color: `${baseColor}60` },
    { from: 2000,   to: 5000,   color: `${baseColor}80` },
    { from: 5000,   to: 8000,   color: `${baseColor}AA` },
    { from: 8000,   to: 13000,  color: `${baseColor}CC` },
    { from: 13000,  to: 500000, color: `${baseColor}FF` },
  ]

  for (const { from, to, color } of threshold){
    if (numberOfVoters >= from && numberOfVoters < to){
      return color
    }
  }
  return 'red'
}

const AllSettlements = ({
  election = "ogy2018",
  aggregatedElectionResultsObject,
  votersNumberDataObject,
  allSettlements,
}) => {
  if (!allSettlements?.features) return null

  const { leiras: electionDescription } = useValasztas({ election }) || {}

  const { lg } = useBreakpoint()

  const [activeSettlement, setActiveSettlement] = useState(null)
  const [state, dispatch] = useReducer(reducer, initialState)


  const handleClickPolygon = (settlementId) => {
    const settlement = allSettlements.features.find(({ _id }) => _id === settlementId)  
    setActiveSettlement(settlement)
  }

  const votersNumberData = votersNumberDataObject?.[activeSettlement?.name] || {}

  console.log(state)

  return (
    <>
      <PageHeaderStyled
        title="Magyarország települései"
        breadcrumb={{ routes:   [{
          path: 'index',
          breadcrumbName: electionDescription || '...',
        }]}}
      />
      <Wrap horizontal={lg}>
        <MapWrap>
          <MapBase
            center={{ lat: 47, lng: 19 }}
            zoom={7.5}
            mapId="85b71dbefa7b82fa"
          >
            {allSettlements.features?.map?.(({
              name,
              geometry,
              settlementType,
              _id: settlementId,
            }) => (
              <MapBase.Polygon
                key={settlementId}
                geometry={geometry}
                onClick={() => handleClickPolygon(settlementId)}
                options={{
                  fillColor: getFillColor({
                    numberOfVoters: votersNumberDataObject?.[name]?.valasztokSzama,
                    isCountrySelected: votersNumberData?.megyeNeve === votersNumberDataObject?.[name]?.megyeNeve,
                  }),
                  ...(settlementId == activeSettlement?._id ? {
                    strokeOpacity: 1,
                    strokeColor: 'black',
                    strokeWeight: 3,
                    zIndex: 5,
                  }: {
                    strokeOpacity: .5,
                    strokeColor: "#386FB3",
                    strokeWeight: 1,
                    zIndex: 1
                  }),
                  ...(settlementType === 'capital' ? {
                    fillColor: "transparent",
                    strokeWeight: 3,
                    clickable: true,                
                    }: {}),                  
                }}
              />
            ))}
          </MapBase>
          {/* <Legend stroke="#FF3333AA" fill="#386FB300" text="OEVK határ" /> */}
          <Legend stroke="#386FB3CC" fill="#386FB355" text="Település-határok" />
        </MapWrap>
        <Drawer
            visible={!!activeSettlement}
            onClose={() => setActiveSettlement(null)}
            maskClosable={false}
            mask={false}
            >
              {activeSettlement && (
                <Descriptions column={1} title={
                  <p>{activeSettlement.name}</p>
                } layout="vertical">
                  <Descriptions.Item label="Választók száma">
                    <strong>{votersNumberData?.valasztokSzama}</strong>
                  </Descriptions.Item>
                  <Descriptions.Item label="Szavazókörök száma">
                    <strong>{votersNumberData?.szavazokorokSzama}</strong>
                  </Descriptions.Item>
                  <Descriptions.Item label="Megye">
                    <strong>{votersNumberData?.megyeNeve}</strong>
                  </Descriptions.Item>
                </Descriptions>
              )}
              <DrawerFooter>
                <TisztaszavazasLogoStyled />
              </DrawerFooter>
          </Drawer>         
      </Wrap>
    </>
  )
}

export default AllSettlements
