import React, { useCallback, useReducer, useMemo, useState, useEffect } from 'react'
import {
  Drawer,
  PageHeader,
  Descriptions,
  Modal,
  Button,
  Space,
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
  LOAD_GROUPPING,
  ADD_POLYLINE_POINT,
  START_NEW_POLYLINE,
  SELECT_POLYLINE,
  TOGGLE_DRAWING,
  REMOVE_SELECTED_POLYLINE,
} from './reducer';
import { OEVK_ID_JOINER } from '../../constants';
import SettlementSaveLoad from './SettlementSaveLoad'

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
`

const OevkTr = styled.tr`
  ${({ $highlighted }) => $highlighted ? `
    td {
      background: #838DA2;
    }
  ` : ``}
`

const BottomInner = styled.div`
  display: flex;
  article {
    flex-direction: column;
    margin-right: 12px;
  }
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
  isInSelectedOevk,
}) => {

  const baseColor =
    isInSelectedOevk ? `#28457B` : 
                        `#aaaaaa`

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
  countyBorders,
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
    activeOevkId,
    polyLines,
    isDrawing,
  } = useMemo(() => mapStateToValues(state), [state])


  const [isSavePopoverOpen, setSavePopoverOpen] = useState(false)
  const [isLoadPopoverOpen, setLoadPopoverOpen] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [savedSets, setSavedSets] = useState({})

  console.log({
    // polyLines
  //   activeSettlement,
  //   activeCountyName,
  //   activeSettlementVotersNumer,
  //   activeCountyOevkData,
  //   oevkAggregations,
  //   winnedOevks,
  //   cityVotersNumberObject,
    // citySzkOevkGroupping,
  //   activeSzkId,
  //   activeOevkId,
    // settlementOevkGroupping,
  //   initialSettlementOevkGroupping,
  })

  if (!allSettlements?.features) return null  

  const handleClickPolygon = (settlementId, e) => {
    dispatch({ type: START_NEW_POLYLINE })
    dispatch({ type: TOGGLE_ACTIVE_SETTLEMENT, payload: { settlementId } })
  }
  
  const handleClickMap = () => {
    dispatch({ type: START_NEW_POLYLINE })
  }

  const handleRightClick = ({ latLng }) => {
    const lng = latLng.lng()
    const lat = latLng.lat()
    dispatch({ type: ADD_POLYLINE_POINT, payload: { lng, lat } })
  }

  const handlePolylineClick = lineId => {
    dispatch({ type: SELECT_POLYLINE, payload: lineId })
  }
  
  const toggleDrawing = () => {
    dispatch({ type: TOGGLE_DRAWING })
  }

  const handleClickRemovePolyline = () => {
    dispatch({ type: REMOVE_SELECTED_POLYLINE })
  }

  const handleClickSzkPin = (citySzkId) => {
    dispatch({ type: TOGGLE_ACTIVE_CITY_SZK, payload: { citySzkId } })
  }
  
  const handleClickDrawerClose = () => {
    dispatch({ type: TOGGLE_ACTIVE_SETTLEMENT, payload: {} })
  }

  const handleLoadGroupping = (setName) => {
    setLoadPopoverOpen(false)
    dispatch({ type: LOAD_GROUPPING, payload: savedSets[setName] })
  }

  const handleSave = useCallback((nameToSave) => {
    try {
      let savedOevkSets = localStorage.getItem('savedOevkSets')
      if (savedOevkSets){
        savedOevkSets = JSON.parse(savedOevkSets)
      } else {
        savedOevkSets = {}
      }

      savedOevkSets = {
        ...savedOevkSets,
        [nameToSave]: {
          citySzkOevkGroupping,
          settlementOevkGroupping,
        }
      }

      savedOevkSets = JSON.stringify(savedOevkSets)
      localStorage.setItem('savedOevkSets', savedOevkSets)
      setSavePopoverOpen(false)
    } catch(error){
      setSaveError(error.message)
    }
  })

  useEffect(() => {
    handleSave('2018-as OEVK határok')
  }, [])

  const handleLoadOpen = () => {
    try {
      let savedOevkSets = localStorage.getItem('savedOevkSets')
      if (savedOevkSets){
        savedOevkSets = JSON.parse(savedOevkSets)
      } else {
        savedOevkSets = {}
      }
      setSavedSets(savedOevkSets)
    } catch(error){

    }
    setLoadPopoverOpen(true)    
  }

  // console.log(state)

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
        title="Magyarország egyéni választókerületi beosztása"
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
            mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID}
            onRightClick={handleRightClick}
            onClick={handleClickMap}
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
                onRightClick={handleRightClick}
                options={{
                  fillColor: getFillColor({
                    numberOfVoters: votersNumberDataObject?.[name]?.valasztokSzama,
                    isInSelectedOevk: activeOevkId && settlementOevkGroupping[name]?.join(OEVK_ID_JOINER) === activeOevkId,
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
              valasztokSzama,
              megyeNeve,
            }) => (
              <MapBase.Polygon
                key={citySzkId}
                geometry={korzethatar}
                onClick={() => handleClickSzkPin(citySzkId)}
                onRightClick={handleRightClick}
                options={{
                  fillColor: getFillColor({
                    numberOfVoters: valasztokSzama,
                    isInSelectedOevk: activeOevkId && citySzkOevkGroupping[citySzkId]?.join(OEVK_ID_JOINER) === activeOevkId,
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
            {countyBorders.features.map(({ geometry }) => (
              <MapBase.Polygon
                geometry={geometry}
                options={{
                  strokeOpacity: .5,
                  strokeColor: "#666",
                  strokeWeight: 3,
                  zIndex: 4,
                  fillOpacity: 0,
                  clickable: false
                }}
              />
            ))}
            {polyLines.map(({ id, isActive, points }) => (
              <>
                <MapBase.Polyline
                  key={id}
                  path={points}
                  onClick={() => handlePolylineClick(id)}
                  options={{
                    strokeColor: isActive ? 'red' : 'black'
                  }}
                />
                {points.map((point, i) => (
                  <MapBase.Circle
                    options={{
                      strokeColor: isActive && i === (points.length - 1) ? 'red' : 'black'
                    }}
                    key={i}
                    center={point}
                    radius={120}
                  />
                ))}
              </>
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
            <BottomInner>
              <article>
                <h3>Elnyert egyéni mandátumok</h3>
                <WinnedWrap>
                  <div>Ellenzék: {winnedOevks.ellenzek}</div>
                  <div>Fidesz: {winnedOevks.fidesz}</div>
                </WinnedWrap>
              </article>
              <article>
                <Space>
                  <SettlementSaveLoad
                    onConfirmSave={handleSave}
                    isPopoverOpen={isSavePopoverOpen}
                    onClickSave={() => setSavePopoverOpen(true)}
                    saveError={saveError}
                    onCancel={() => setSavePopoverOpen(false)}
                    onClickLoad={handleLoadOpen}
                    isLoadOpen={isLoadPopoverOpen}
                    loadOptions={Object.keys(savedSets).map(name => ({ id: name, name }))}
                    onCancelLoad={() => setLoadPopoverOpen(false)}
                    onConfirmLoad={handleLoadGroupping}
                  />
                  
                  <Button
                    onClick={toggleDrawing}
                  >
                    {isDrawing ? 'Rajzolás befejezése' : 'Vonal rajzolása'}
                  </Button>
                </Space>
              </article>
            </BottomInner>
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
                <Descriptions.Item
                  label={`Melyik OEVK-ba kerüljön a ${activeSettlement ? 'település' : 'szavazókör'}?`}
                >
                <OevkSetter>
                <thead>
                  <tr>
                    <th colspan={3}>
                    {
                    activeSettlementVotersNumer?.megyeNeve ||
                    activeSzk?.megyeNeve
                  }
                    </th>
                  </tr>
                  <tr>
                    <th>OEVK</th>
                    <th>Szavazó</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {activeCountyOevkData?.oevkIds.map(oevkId => (
                    <OevkTr
                      $highlighted={oevkId === activeOevkId}
                      key={oevkId}>
                      <td>
                        {oevkId.split(OEVK_ID_JOINER)[1]}
                      </td>
                      <VoterNumTd>
                        {oevkAggregations[oevkId]?.valasztokSzama || '-'}
                      </VoterNumTd>
                      <td>
                      <OevkButton
                        onClick={() => handleAddToOevk(oevkId)}
                        disabled={oevkId === activeOevkId}
                        >
                        Ebbe
                      </OevkButton>
                      </td>
                    </OevkTr>
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
        <Modal title="Vonal rajzolása"
          visible={isDrawing}
          onCancel={toggleDrawing}
          cancelText="Bezár"
          footer={null}
          maskClosable={false}
          mask={false}
          style={{ marginLeft: 40 }}
          maskStyle={{ pointerEvents: 'none' }}
          >
          <Space>
            <textarea value={
              JSON.stringify(polyLines, null, 2)
            }/>
            <Button
              onClick={handleClickRemovePolyline}
              >
              Kijelölt görbe törlése
            </Button>
          </Space>
        </Modal>          
              
      </Wrap>
    </>
  )
}

export default AllSettlements
