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
import reducer, {
  initialState,
  mapStateToValues,
  TOGGLE_SETTLEMENT_TO_OEVK,
  TOGGLE_ACTIVE_SETTLEMENT
} from './reducer';
import { useMemo } from 'react';

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

const OevkSetter = styled.table`
  td, th {
    padding: 4px;
  }
  margin-bottom: 40px;
`

const OevkButton = styled.button`
  cursor: pointer;
  ${({ $highlighted }) => $highlighted ? `
    background: #888;
  ` : ``}
`

const WinnedWrap = styled.div`
  display: flex;
  > * {
    margin-right: 30px;
  }
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
  szavazatokTelepulesenkent,
  votersNumberDataObject,
  allSettlements,
  countiesAndOevksObject,
}) => {
  const { leiras: electionDescription } = useValasztas({ election }) || {}

  const { lg } = useBreakpoint()

  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    allSettlements,
    votersNumberDataObject,
    countiesAndOevksObject,
    szavazatokTelepulesenkent,
  })

  const {
    activeSettlement,
    activeSettlementVotersNumer,
    oevkAggregations,
    activeCountyOevkData,
    activeSettlementOevkId,
    winnedOevks,
  } = useMemo(() => mapStateToValues(state), [state])

  console.log({
    activeSettlement,
    activeSettlementVotersNumer,
    activeCountyOevkData,
    oevkAggregations,
    activeSettlementOevkId,
    winnedOevks,
  })

  if (!allSettlements?.features) return null  

  const handleClickPolygon = (settlementId) => {
    dispatch({ type: TOGGLE_ACTIVE_SETTLEMENT, payload: { settlementId } })
  }
  
  const handleClickDrawerClose = () => {
    dispatch({ type: TOGGLE_ACTIVE_SETTLEMENT, payload: {} })
  }

  console.log(state)

  const handleAddToOevk = oevkId => {
    dispatch({ type: TOGGLE_SETTLEMENT_TO_OEVK, payload: { oevkId } })
  }

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
                    isCountrySelected: activeSettlementVotersNumer?.megyeNeve === votersNumberDataObject?.[name]?.megyeNeve,
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
          visible
          placement='bottom'
          maskClosable={false}
          mask={false}
          closable={false}
          height={100}
          >
            <h3>Elnyert egyéni mandátumok</h3>
            <WinnedWrap>
              <div>Ellenzék: {winnedOevks.ellenzek}</div>
              <div>Fidesz: {winnedOevks.fidesz}</div>
            </WinnedWrap>
        </Drawer>        
        <Drawer
            visible={!!activeSettlement}
            onClose={handleClickDrawerClose}
            maskClosable={false}
            mask={false}
            >
              {activeSettlement && (
                <Descriptions column={1} title={
                  <p>{activeSettlement.name}</p>
                } layout="vertical">
                  <Descriptions.Item label="Választók száma">
                    <strong>{activeSettlementVotersNumer?.valasztokSzama}</strong>
                  </Descriptions.Item>
                  <Descriptions.Item label="Szavazókörök száma">
                    <strong>{activeSettlementVotersNumer?.szavazokorokSzama}</strong>
                  </Descriptions.Item>
                  <Descriptions.Item label="Megye">
                    <strong>{activeSettlementVotersNumer?.megyeNeve}</strong>
                  </Descriptions.Item>
                <Descriptions.Item label="Település elhelyezése">
                <OevkSetter>
                  <thead>
                    <tr>
                      <th colspan="2">Szavazók száma</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeCountyOevkData?.oevkIds.map(oevkId => (
                      <tr key={oevkId}>
                        <td>
                          <OevkButton
                            $highlighted={oevkId === activeSettlementOevkId}
                            onClick={() => handleAddToOevk(oevkId)}
                            >
                            {oevkId.split('|')[1]}
                          </OevkButton>
                        </td>
                        <td>
                          {oevkAggregations[oevkId]?.valasztokSzama || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </OevkSetter>
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
