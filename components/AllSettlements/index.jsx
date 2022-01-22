import React, { useReducer } from 'react'
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
  TOGGLE_ACTIVE_SETTLEMENT,
  TOGGLE_ACTIVE_CITY_SZK,
  TOGGLE_CITY_SZK_TO_OEVK,
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
  bottom: 0;
  background: white;
  width: 100%;
  padding: 10px;
  left: 0;
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

const VoterNumTd = styled.td`
  text-align: right;
`

const getFillColor = ({
  numberOfVoters,
  isCountrySelected,
  isInSelectedOevk,
}) => {

  const baseColor =
    isInSelectedOevk  ? `#8b2801` :
    isCountrySelected ? `#28457B` : 
                        `#bdbd4b`

  return  (
    numberOfVoters > 13000 ? `${baseColor}B4` :
    numberOfVoters > 8000  ? `${baseColor}A1` :
    numberOfVoters > 5000  ? `${baseColor}80` :
    numberOfVoters > 2000  ? `${baseColor}60` :
    numberOfVoters > 1000  ? `${baseColor}40` :
                             `${baseColor}20` 
  )
}

const AllSettlements = ({
  election = "ogy2018",
  allSettlements,
  votersNumberDataObject,
  szavazatokTelepulesenkent,
  countiesAndOevksObject,
  cityVotersNumberObject,
  szavazatokVarosiSzavazokorben,
  initialSettlementOevkGroupping,
  initialCitySzkOevkGroupping,
}) => {
  const { leiras: electionDescription } = useValasztas({ election }) || {}

  const { lg } = useBreakpoint()

  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    allSettlements,
    votersNumberDataObject,
    szavazatokTelepulesenkent,
    countiesAndOevksObject,
    cityVotersNumberObject,
    szavazatokVarosiSzavazokorben,
    settlementOevkGroupping: initialSettlementOevkGroupping,
    citySzkOevkGroupping: initialCitySzkOevkGroupping,
  })

  const {
    activeSettlement,
    activeSettlementVotersNumer,
    oevkAggregations,
    activeCountyOevkData,
    winnedOevks,
    settlementOevkGroupping,
    activeSzk,
    activeCountyName,
    activeAdminUnitName,
    citySzkOevkGroupping,
    activeSzkId,
    activeOevkId
  } = useMemo(() => mapStateToValues(state), [state])

  console.log({
    activeSettlement,
    activeCountyName,
    activeSettlementVotersNumer,
    activeCountyOevkData,
    oevkAggregations,
    winnedOevks,
    cityVotersNumberObject,
    citySzkOevkGroupping,
    activeSzkId,
    activeOevkId,
    initialSettlementOevkGroupping,
  })

  if (!allSettlements?.features) return null  

  const handleClickPolygon = (settlementId) => {
    dispatch({ type: TOGGLE_ACTIVE_SETTLEMENT, payload: { settlementId } })
  }

  const handleClickSzkPin = (citySzkId) => {
    dispatch({ type: TOGGLE_ACTIVE_CITY_SZK, payload: { citySzkId } })
  }
  
  const handleClickDrawerClose = () => {
    dispatch({ type: TOGGLE_ACTIVE_SETTLEMENT, payload: {} })
  }

  console.log(state)

  const handleAddToOevk = oevkId => {
    if (activeSzk){
      dispatch({ type: TOGGLE_CITY_SZK_TO_OEVK, payload: { oevkId } })
    } else {
      dispatch({ type: TOGGLE_SETTLEMENT_TO_OEVK, payload: { oevkId } })
    }
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
              szavazokoriBontas,
              _id: settlementId,
              }) => (
              <MapBase.Polygon
                key={settlementId}
                geometry={geometry}
                onClick={() => handleClickPolygon(settlementId)}
                options={{
                  fillColor: getFillColor({
                    numberOfVoters: votersNumberDataObject?.[name]?.valasztokSzama,
                    isCountrySelected: activeCountyName === votersNumberDataObject?.[name]?.megyeNeve,
                    isInSelectedOevk: activeOevkId && settlementOevkGroupping[name]?.join('|') === activeOevkId,
                  }),
                  ...(settlementId == activeSettlement?._id ? {
                    strokeOpacity: 1,
                    strokeColor: 'black',
                    strokeWeight: 3,
                    zIndex: 5,
                  }: {
                    strokeOpacity: .5,
                    strokeColor: "#999999",
                    strokeWeight: 1,
                    zIndex: 1
                  }),
                  ...(szavazokoriBontas ? {
                    fillColor: "transparent",
                    strokeColor: '#333333',
                    strokeWeight: 3,
                    clickable: false,                
                    }: {}),                  
                }}
              />
            ))}
            {Object.values(cityVotersNumberObject).map(({
              citySzkId,
              korzethatar,
              szavazohelyisegHelye,
              valasztokSzama,
              megyeNeve,
            }) => (
              <MapBase.Polygon
                key={citySzkId}
                geometry={korzethatar}
                onClick={() => handleClickSzkPin(citySzkId)}
                options={{
                  fillColor: getFillColor({
                    numberOfVoters: valasztokSzama,
                    isCountrySelected: activeCountyName === megyeNeve,
                    isInSelectedOevk: activeOevkId && citySzkOevkGroupping[citySzkId]?.join('|') === activeOevkId,
                  }),
                  ...(activeSzk?.citySzkId === citySzkId ? {
                    strokeOpacity: 1,
                    strokeColor: 'black',
                    strokeWeight: 3,
                    zIndex: 5,
                  }: {
                    strokeOpacity: .5,
                    strokeColor: "#999999",
                    strokeWeight: 1,
                    zIndex: 1
                  })
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
            visible={!!activeSettlement || !!activeSzk}
            onClose={handleClickDrawerClose}
            maskClosable={false}
            mask={false}
            >
              {(activeSettlement || activeSzk) && (
                <Descriptions column={1} title={
                  <p>{activeAdminUnitName}</p>
                } layout="vertical">
                  <Descriptions.Item label="Választók száma">
                    <strong>
                      {
                        activeSettlementVotersNumer?.valasztokSzama ||
                        activeSzk?.valasztokSzama
                      }
                    </strong>
                  </Descriptions.Item>
                  <Descriptions.Item label="Szavazókörök száma">
                    <strong>{activeSettlementVotersNumer?.szavazokorokSzama || 1}</strong>
                  </Descriptions.Item>
                  <Descriptions.Item label="Megye">
                    <strong>{
                      activeSettlementVotersNumer?.megyeNeve ||
                      activeSzk?.megyeNeve
                    }</strong>
                  </Descriptions.Item>
                <Descriptions.Item
                  label={`Melyik OEVK-ba kerüljön a ${activeSettlement ? 'település' : 'szavazókör'}?`}
                >
                <OevkSetter>
                  <thead>
                    <tr>
                      <th>OEVK</th>
                      <th>Szavazó</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {activeCountyOevkData?.oevkIds.map(oevkId => (
                      <tr key={oevkId}>
                        <td>
                          {oevkId.split('|')[1]}
                        </td>
                        <VoterNumTd>
                          {oevkAggregations[oevkId]?.valasztokSzama || 0}
                        </VoterNumTd>
                        <td>
                        <OevkButton
                            $highlighted={oevkId === activeOevkId}
                            onClick={() => handleAddToOevk(oevkId)}
                            >
                            Ebbe
                          </OevkButton>
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
