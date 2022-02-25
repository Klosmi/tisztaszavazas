import React, { useCallback, useReducer, useMemo, useState, useEffect } from 'react'
import {
  Drawer,
  Descriptions,
  Modal,
  Button,
  Space,
  Checkbox,
  Typography
} from 'antd';
import MapBase from '../MapBase'
import Legend from '../Legend'
import useValasztas from '../../hooks/useValasztas';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import reducer, {
  initialState,
  mapStateToValues,
  TOGGLE_SETTLEMENT_TO_OEVK,
  TOGGLE_ACTIVE_SETTLEMENT,
  TOGGLE_ACTIVE_CITY_SZK,
  TOGGLE_CITY_SZK_TO_OEVK,
  TOGGLE_AREA_TO_OEVK,
  LOAD_GROUPPING,
  ADD_POLYLINE_POINT,
  DESELECT_POLYLINES,
  SELECT_POLYLINE,
  TOGGLE_DRAWING,
  REMOVE_SELECTED_POLYLINE,
  RESET_POLYLINES,
  ADD_POLYLINES_JSON,
  SELECT_POINT,
  MOVE_ACTIVE_POINT,
  DELETE_ACTIVE_POINT,
  COPY_POINT,
  EDIT_COPIED_POINTS_JSON,
  SELECT_CITY_AREA,
  ADD_SZK_TO_AREA,
} from './reducer';
import { OEVK_ID_JOINER } from '../../constants';
import SettlementSaveLoad from './SettlementSaveLoad'
import {
  Wrap,
  MapWrap,
  PageHeaderStyled,
  TisztaszavazasLogoStyled,
  DrawerFooter,
  OevkSetter,
  OevkButton,
  OevkTr,
  BottomInner,
  WinnedWrap,
  VoterNumTd,
} from './styles'


const getFillColor = ({
  numberOfVoters,
  isInSelectedOevk,
  isInActiveCityArea,
}) => {

  if (isInActiveCityArea) return 'red'

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
  cityAreas,
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
    cityAreas,
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
    copiedPoints,
    activeArea,
    activeAreaSzkIds,
  } = useMemo(() => mapStateToValues(state), [state])


  const [isSavePopoverOpen, setSavePopoverOpen] = useState(false)
  const [isLoadPopoverOpen, setLoadPopoverOpen] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [savedSets, setSavedSets] = useState({})
  const [showAreas, setShowAreas] = useState(false)
  const [szkAddingMode, setSzkAddingMode] = useState(false)
  const [hideAddedSzks, setHideAddedSzks] = useState(false)

  // console.log({
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
  // activeAreaSzkIds
  // })

  if (!allSettlements?.features) return null  

  const handleClickPolygon = (settlementId, e) => {
    dispatch({ type: DESELECT_POLYLINES })
    dispatch({ type: TOGGLE_ACTIVE_SETTLEMENT, payload: { settlementId } })
  }
  
  const handleClickCityArea = (cityName, cityAreaId, megyeKod) => {
    dispatch({ type: DESELECT_POLYLINES })
    if (!szkAddingMode){
      dispatch({ type: SELECT_CITY_AREA, payload: { cityName, cityAreaId, megyeKod } })
    }
  }
  
  const handleClickMap = () => {
    dispatch({ type: DESELECT_POLYLINES })
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

  const handleResetPoligons = () => {
    dispatch({ type: RESET_POLYLINES })
  }

  const handleCopyPoint = () => {
    dispatch({ type: COPY_POINT })
  }

  const handleClickRemovePolyline = () => {
    dispatch({ type: REMOVE_SELECTED_POLYLINE })
  }

  const handleDeletePoint = () => {
    dispatch({ type: DELETE_ACTIVE_POINT })
  }


  const handlePointClick = (lineId, pointId) => {
    dispatch({ type: SELECT_POINT, payload: { lineId, pointId } })
  }

  const handleAddPolylinesJson = ({ target: { value }}) => {
    dispatch({ type: ADD_POLYLINES_JSON, payload: value })
  }

  const handleCopiendPointsEdit = ({ target: { value }}) => {
    dispatch({ type: EDIT_COPIED_POINTS_JSON, payload: value })
  }

  const handleClickSzkPolygon = (citySzkId) => {
    dispatch({ type: DESELECT_POLYLINES })
    if (szkAddingMode){
      dispatch({ type: ADD_SZK_TO_AREA, payload: { citySzkId } })
    } else {
      dispatch({ type: TOGGLE_ACTIVE_CITY_SZK, payload: { citySzkId } })
    }
  }

  const movePoint = direction => {
    dispatch({ type: MOVE_ACTIVE_POINT, payload: direction })
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
    } else if (activeArea) {
      dispatch({ type: TOGGLE_AREA_TO_OEVK, payload: { oevkId } })
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

            {cityAreas.features.map(({ features, name: cityName, properties: cityProperty }) => (
              features.map(({ id, geometry, properties }) => (
                <MapBase.Polygon
                  key={id}
                  geometry={geometry}
                  onClick={() => handleClickCityArea(cityName, id, cityProperty?.megyeKod)}
                  options={{
                    strokeColor: id === activeArea?.id ? "black" : showAreas ? "#7a59126c" : "#7a591233",
                    fillColor: properties?.highlighted ? "#dd555588" : "transparent",
                    strokeWeight: 3,
                    zIndex: showAreas && !szkAddingMode ? 8 : 0
                  }}
                />
              ))
            ))}
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
              !(activeAreaSzkIds.includes(citySzkId) && hideAddedSzks) && (
              <MapBase.Polygon
                key={citySzkId}
                geometry={korzethatar}
                onClick={() => handleClickSzkPolygon(citySzkId)}
                onRightClick={handleRightClick}
                options={{
                  fillColor: getFillColor({
                    numberOfVoters: valasztokSzama,
                    isInSelectedOevk: activeOevkId && citySzkOevkGroupping[citySzkId]?.join(OEVK_ID_JOINER) === activeOevkId,
                    isInActiveCityArea: activeAreaSzkIds.includes(citySzkId)
                  }),
                  ...(activeSzk?.citySzkId === citySzkId && !showAreas ? {
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
              />)
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
            {polyLines.map(({ id: lineId, isActive, points }) => (
              <>
                <MapBase.Polyline
                  key={lineId}
                  path={points}
                  onClick={() => handlePolylineClick(lineId)}
                  options={{
                    strokeColor: isActive ? 'red' : 'black',
                    zIndex: 6
                  }}
                />
                {points.map((point) => (
                  <MapBase.Circle
                    onClick={() => handlePointClick(lineId, point.id)}
                    options={{
                      strokeColor: isActive && point.isSelected ? 'red' : 'black',
                      zIndex: 7
                    }}
                    key={point.id}
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
                  <Checkbox
                    onChange={() => setShowAreas(!showAreas)}
                    value={showAreas}
                  >Városrészek használata
                  </Checkbox>
                    
{/*                   <SettlementSaveLoad
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
                  /> */}
                  
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
          visible={!!activeSettlement || !!activeSzk || !!activeArea}
          onClose={handleClickDrawerClose}
          maskClosable={false}
          mask={false}
          >
            {(activeSettlement || activeSzk || activeArea) && (
              <Descriptions column={1} title={
                <p>{activeAdminUnitName}</p>
              } layout="vertical">
                {!activeArea && (
                  <Descriptions.Item label="Választók száma">
                    <strong>
                      {
                        activeArea ? '-' :
                        activeSettlementVotersNumer?.valasztokSzama ||
                        activeSzk?.valasztokSzama
                      }
                    </strong>
                  </Descriptions.Item>
                )}
                {activeArea && (
                  <Descriptions.Item label="Szavazókörök">
                    <strong>
                      {`${activeArea?.properties?.szavazokorok.join(', ')}`}
                    </strong>
                  </Descriptions.Item>
                )}
                <Descriptions.Item
                  label={`Melyik OEVK-ba kerüljön a ${activeSettlement ? 'település' : activeArea ? 'városrész összes szavazóköre' : 'szavazókör'}?`}
                >
                <OevkSetter>
                <thead>
                  <tr>
                    <th colSpan={3}>
                    {
                    activeSettlementVotersNumer?.megyeNeve ||
                    activeSzk?.megyeNeve ||
                    activeArea?.megyeNeve
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
            <>
              <Checkbox
                onChange={() => setSzkAddingMode(!szkAddingMode)}
                value={szkAddingMode}
              >
                Szavazókörök hozzáadása
              </Checkbox>
              {szkAddingMode && (
                <Typography.Text type="secondary">
                  Kattints a szavazókörre a hozzáadáshoz
                </Typography.Text>
              )}
            </>
            <DrawerFooter>
              <TisztaszavazasLogoStyled />
            </DrawerFooter>
        </Drawer>
        <Modal title={isDrawing ? "Vonal rajzolása" : "Szavazókör városrészhez adása"}
          visible={isDrawing || szkAddingMode}
          onCancel={toggleDrawing}
          cancelText="Bezár"
          footer={null}
          maskClosable={false}
          mask={false}
          style={{ marginLeft: 40 }}
          maskStyle={{ pointerEvents: 'none' }}
          >
          {isDrawing && (
            <Space>
              <Space direction='vertical'>
                <textarea
                  value={JSON.stringify(polyLines, null, 2)}
                  onChange={handleAddPolylinesJson}
                />
                <textarea
                  value={JSON.stringify(copiedPoints, null, 2)}
                  onChange={handleCopiendPointsEdit}
                />
              </Space>
              <Space direction='vertical'>
                <Button
                  onClick={handleClickRemovePolyline}
                  >
                  Kijelölt görbe törlése
                </Button>
                <Button
                  onClick={handleDeletePoint}
                  >
                  Kijelölt pont törlése
                </Button>
                <Button
                  onClick={handleResetPoligons}
                  >
                  Alaphelyzetbe állítás
                </Button>
                <Button
                  onClick={handleCopyPoint}
                  >
                  Másolás
                </Button>
              </Space>
              <Space direction='vertical'>
                <h5 style={{ textAlign: 'center' }}>Pont mozgatása</h5>
                <Button onClick={() => movePoint('up')} style={{ marginLeft: 30 }}>Fel</Button>
                <Space>
                  <Button onClick={() => movePoint('left')}>Bal</Button>
                  <Button onClick={() => movePoint('right')}>Jobb</Button>
                </Space>
                <Button onClick={() => movePoint('down')} style={{ marginLeft: 30 }}>Le</Button>
              </Space>
            </Space>
          )}
          {szkAddingMode && (
            <Space>
            <textarea
              value={
              JSON.stringify({
                id: activeArea.id,
                name: activeArea.name,
                type: activeArea.type,
                properties: activeArea.properties,
                geometry: activeArea.geometry,
              }, null, 2)} />
              <Checkbox
                onChange={() => setHideAddedSzks(!hideAddedSzks)}
              >
                Hozzáadottak elrejtése
              </Checkbox>
              </Space>
          )}
        </Modal>          
              
      </Wrap>
    </>
  )
}

export default AllSettlements
