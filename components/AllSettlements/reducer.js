import { CITY_SZK_ID_JOINER, OEVK_ID_JOINER } from "../../constants"

export const TOGGLE_SETTLEMENT_TO_OEVK = 'TOGGLE_SETTLEMENT_TO_OEVK'
export const TOGGLE_ACTIVE_SETTLEMENT = 'TOGGLE_ACTIVE_SETTLEMENT'
export const TOGGLE_ACTIVE_CITY_SZK = 'TOGGLE_ACTIVE_CITY_SZK'
export const TOGGLE_CITY_SZK_TO_OEVK = 'TOGGLE_CITY_SZK_TO_OEVK'
export const LOAD_GROUPPING = 'LOAD_GROUPPING'
export const ADD_POLYLINE_POINT = 'ADD_POLYLINE_POINT'
export const DESELECT_POLYLINES = 'DESELECT_POLYLINES'
export const SELECT_POLYLINE = 'SELECT_POLYLINE'
export const TOGGLE_DRAWING = 'TOGGLE_DRAWING'
export const REMOVE_SELECTED_POLYLINE = 'REMOVE_SELECTED_POLYLINE'
export const RESET_POLYLINES = 'RESET_POLYLINES'
export const ADD_POLYLINES_JSON = 'ADD_POLYLINES_JSON'
export const SELECT_POINT = 'SELECT_POINT'
export const MOVE_ACTIVE_POINT = 'MOVE_ACTIVE_POINT'
export const DELETE_ACTIVE_POINT = 'DELETE_ACTIVE_POINT'
export const COPY_POINT = 'COPY_POINT'
export const EDIT_COPIED_POINTS_JSON = 'EDIT_COPIED_POINTS_JSON'
export const SELECT_CITY_AREA = 'SELECT_CITY_AREA'
export const TOGGLE_AREA_TO_OEVK = 'TOGGLE_AREA_TO_OEVK'
export const ADD_SZK_TO_AREA = 'ADD_SZK_TO_AREA'

export const initialState = {
  activeSettlement: null,
  allSettlements: [],
  countiesAndOevks: [],
  szavazatokTelepulesenkent: {},
  settlementOevkGroupping: {},
  citySzkOevkGroupping: {},
  cityVotersNumberObject: {},
  szavazatokVarosiSzavazokorben: {},
  activeSzk: null,
  polyLines: [],
  isDrawing: false,
  copiedPoints: [],
  cityAreas: []
}

const getOevkAggregations = ({
  settlementOevkGroupping,
  szavazatokTelepulesenkent,
  votersNumberDataObject,
  citySzkOevkGroupping,
  cityVotersNumberObject,
  szavazatokVarosiSzavazokorben,
}) => {
  const getTelepulesAggregation = () => {
    const telepulesAggregation = {}

    for (const [settlementName, [countyCode, oevkNum]] of Object.entries(settlementOevkGroupping)) {
      const {
        ellenzek = 0,
        fidesz = 0,
        osszes = 0
      } = szavazatokTelepulesenkent[settlementName] || {}

      const {
        valasztokSzama
      } = votersNumberDataObject[settlementName] || {}

      const oevkId = `${countyCode}${OEVK_ID_JOINER}${oevkNum}`

      telepulesAggregation[oevkId] = {
        ellenzek: (telepulesAggregation[oevkId]?.ellenzek || 0) + ellenzek,
        fidesz: (telepulesAggregation[oevkId]?.fidesz || 0) + fidesz,
        osszes: (telepulesAggregation[oevkId]?.osszes || 0) + osszes,
        valasztokSzama: (telepulesAggregation[oevkId]?.valasztokSzama || 0) + valasztokSzama,
      }
    }

    return telepulesAggregation
  }

  const getCitySzkAggregation = () => {
    const citySzkAggregation = {}

    for (const [citySzkId, [countyCode, oevkNum]] of Object.entries(citySzkOevkGroupping)) {
      const {
        ellenzek = 0,
        fidesz = 0,
        osszes = 0
      } = szavazatokVarosiSzavazokorben[citySzkId] || {}

      const {
        valasztokSzama
      } = cityVotersNumberObject[citySzkId] || {}

      const oevkId = `${countyCode}${OEVK_ID_JOINER}${oevkNum}`
      
      citySzkAggregation[oevkId] = {
        ellenzek: (citySzkAggregation[oevkId]?.ellenzek || 0) + ellenzek,
        fidesz: (citySzkAggregation[oevkId]?.fidesz || 0) + fidesz,
        osszes: (citySzkAggregation[oevkId]?.osszes || 0) + osszes,
        valasztokSzama: (citySzkAggregation[oevkId]?.valasztokSzama || 0) + valasztokSzama,
      }
    }

    return citySzkAggregation
  }
  
   const oevkAggregations = (
     Object.entries(getCitySzkAggregation())
     .reduce((acc, [oevkId, {
      ellenzek,
      fidesz,
      osszes,
      valasztokSzama,
     }]) => {
       if (acc[oevkId]){
        acc[oevkId].ellenzek += ellenzek
        acc[oevkId].fidesz += fidesz
        acc[oevkId].osszes += osszes
        acc[oevkId].valasztokSzama += valasztokSzama
       } else {
         acc[oevkId] = {
          ellenzek,
          fidesz,
          osszes,
          valasztokSzama,
         }
       }

       return acc
     }, getTelepulesAggregation())
   )

  return oevkAggregations
}

const getActiveCountyOevkData = ({
  activeSettlementVotersNumer,
  countiesAndOevksObject,
  activeSzk,
  activeArea,
}) => {

  const activeCountyOevkData = (
    activeSzk ? 
    countiesAndOevksObject[activeSzk.megyeKod] : 
    activeArea ?
    countiesAndOevksObject[activeArea.megyeKod] :
    countiesAndOevksObject[activeSettlementVotersNumer?.megyeKod]
  )
  return activeCountyOevkData
}

const getActiveSettlementOevkId = ({
  settlementOevkGroupping,
  activeSettlement,
}) => {
  const activeSettlementOevkId = (
    settlementOevkGroupping[activeSettlement?.name]?.
    join(OEVK_ID_JOINER)
  )
  return activeSettlementOevkId
}


const getActiveSzkOevkId = ({
  citySzkOevkGroupping,
  activeSzkId,
}) => {
  const activeSzkOevkId = (
    citySzkOevkGroupping[activeSzkId]
    ?.join(OEVK_ID_JOINER)
  )

  return activeSzkOevkId
}

const getWinnedOevks = ({
  oevkAggregations
}) => {
  return Object.values(oevkAggregations).reduce((acc, { ellenzek, fidesz }) => {
    if (ellenzek > fidesz){
      acc.ellenzek++
    } else {
      acc.fidesz++
    }
    return acc
  }, { ellenzek: 0, fidesz: 0 })
}

const getActivePointCoordinates = ({ polyLines }) => {
  const { lng, lat } = polyLines.find(({ isActive }) => isActive)?.points?.find(({ isSelected }) => isSelected) || {}
  return [lng, lat]
}

export const mapStateToValues = state => {
  const activeSettlementVotersNumer = (
    state.
    votersNumberDataObject?.
    [state.activeSettlement?.name]
  ) || {}

  const citySzkOevkGroupping = state.citySzkOevkGroupping

  const activeSzk = state.activeSzk

  const activeSzkId = activeSzk?.citySzkId

  const oevkAggregations = getOevkAggregations({
    settlementOevkGroupping: state.settlementOevkGroupping,
    szavazatokTelepulesenkent: state.szavazatokTelepulesenkent,
    votersNumberDataObject: state.votersNumberDataObject,
    citySzkOevkGroupping,
    cityVotersNumberObject: state.cityVotersNumberObject,
    szavazatokVarosiSzavazokorben: state.szavazatokVarosiSzavazokorben,
  })

  const activeCountyOevkData = getActiveCountyOevkData({
    activeSzk: state.activeSzk,
    activeSettlementVotersNumer,
    activeArea: state.activeArea,
    countiesAndOevksObject: state.countiesAndOevksObject,
  })


  const activeSettlementOevkId = getActiveSettlementOevkId({
    settlementOevkGroupping: state.settlementOevkGroupping,
    activeSettlement: state.activeSettlement,
  })


  const activeSzkOevkId = getActiveSzkOevkId({
    citySzkOevkGroupping,
    activeSzkId,
  })

  const winnedOevks = getWinnedOevks({
    oevkAggregations
  })


  const activeCountyName = activeSettlementVotersNumer?.megyeNeve || activeSzk?.megyeNeve

  const activeSettlement = state.activeSettlement


  return {
    activeSettlement,
    allSettlements: state.allSettlements,
    activeSettlementVotersNumer,
    activeCountyName,
    oevkAggregations,
    activeCountyOevkData,
    winnedOevks,
    settlementOevkGroupping: state.settlementOevkGroupping,
    cityVotersNumberObject: state.cityVotersNumberObject,
    citySzkOevkGroupping,
    activeSzk,
    activeSzkId,
    activeAdminUnitName: state.activeArea?.name || activeSettlement?.name || activeSzk?.citySzkId,
    activeOevkId: activeSettlementOevkId || activeSzkOevkId,
    polyLines: state.polyLines,
    isDrawing: state.isDrawing,
    copiedPoints: state.copiedPoints,
    activeArea: state.activeArea,
    activeAreaSzkIds: state.activeArea?.properties?.szavazokorok?.map(szkNum => `${state.activeArea.cityName}${CITY_SZK_ID_JOINER}${szkNum}`) || []
  }
}

const getGroupping = (state, { oevkId }) => {
  const settlementName = state.activeSettlement?.name || state.activeSzk?.citySzkId

  return ({
    ...state.settlementOevkGroupping,
    [settlementName]: oevkId.split(OEVK_ID_JOINER).map(n => parseInt(n))
  })
}

const getSzkGroupping = (state, { oevkId }) => {
  const { citySzkId } = state.activeSzk
  return {
    ...state.citySzkOevkGroupping,
    [citySzkId]: oevkId.split(CITY_SZK_ID_JOINER).map(n => parseInt(n))
  }
}

const groupSzksViaArea = (state, { oevkId }) => {
  const { cityName, properties } = state.activeArea
  const oevkIdArr = oevkId.split(CITY_SZK_ID_JOINER).map(n => parseInt(n))
  const { szavazokorok } = properties || {}

  let addingSzks = {}
  let szkIdToSelect

  for (let szkNum of szavazokorok){
    szkIdToSelect = `${cityName}${CITY_SZK_ID_JOINER}${szkNum}`
    addingSzks[szkIdToSelect] = oevkIdArr
  }

  
  return {
    citySzkOevkGroupping: {
      ...state.citySzkOevkGroupping,
      ...addingSzks,
    },
    activeSzk: state.cityVotersNumberObject[szkIdToSelect] || {},
  }
}

const getNextLatLng = ({ lng, lat }, direction) => {
  // console.log({ lng, lat, direction })
  let nextLng = lng
  let nextLat = lat

  if (direction === 'up'){
    nextLat = ((Math.ceil(lat * 1000)) + 1)/1000
  }
  if (direction === 'down'){
    nextLat = ((Math.ceil(lat * 1000)) - 1)/1000
  }
  if (direction === 'right'){
    nextLng = ((Math.ceil(lng * 1000)) + 1)/1000
  }  
  if (direction === 'left'){
    nextLng = ((Math.ceil(lng * 1000)) - 1)/1000
  }  
  return {
    lng: nextLng,
    lat: nextLat,
  }
}

const toggleToActiveAreaSzks = (state, { citySzkId }) => {
  const szkNum = parseInt(citySzkId.split(CITY_SZK_ID_JOINER)[1])
  const { szavazokorok } = state.activeArea?.properties || {}

  return szavazokorok?.includes(szkNum) ? 
  szavazokorok.filter(s => s !== szkNum) :
  [
    ...(szavazokorok || []),
    szkNum
  ]  
}

const reducer = (state, { type, payload }) => {
  console.log(type, payload)
  let hasActiveLine = false
    try {
    switch(type){
      case TOGGLE_SETTLEMENT_TO_OEVK: return {
        ...state,
        settlementOevkGroupping: getGroupping(state, payload)
      }

      case TOGGLE_CITY_SZK_TO_OEVK: return {
        ...state,
        citySzkOevkGroupping: getSzkGroupping(state, payload)
      }

      case TOGGLE_AREA_TO_OEVK: return {
        ...state,
        ...groupSzksViaArea(state, payload)
      }

      case TOGGLE_ACTIVE_SETTLEMENT: return {
        ...state,
        activeSzk: null,
        activeArea: null,
        activeSettlement: state.allSettlements.features.find(({ _id }) => _id === payload.settlementId) || null,
      }

      case TOGGLE_ACTIVE_CITY_SZK: return {
        ...state,
        activeSettlement: null,
        activeArea: null,
        activeSzk: state.cityVotersNumberObject[payload.citySzkId] || {},
      }

      case SELECT_CITY_AREA: return {
        ...state,
        activeSettlement: null,
        activeSzk: null,
        activeArea: {
          ...state.cityAreas.features.find(({ name }) => name === payload.cityName)?.features.find(({ id }) => id === payload.cityAreaId),
          cityName: payload.cityName,
          megyeKod: payload.megyeKod,
          megyeNeve: state.countiesAndOevksObject[payload.megyeKod]?.megyeNeve
        }
      }

      case LOAD_GROUPPING: return {
        ...state,
        citySzkOevkGroupping: payload.citySzkOevkGroupping,
        settlementOevkGroupping: payload.settlementOevkGroupping,
      }

      case ADD_POLYLINE_POINT: return {
        ...state,
        polyLines: [...state.polyLines.map(pl => {
          if (pl.isActive){
            hasActiveLine = true
            return {
              ...pl,
              points: [
                ...pl.points.map(pt => ({
                  ...pt,
                  isSelected: false
                })),
                {
                  id: + new Date(),
                  isSelected: true,
                  ...payload
                }
              ]
            }
          }
          return pl
        }),
        ...(hasActiveLine ? [] : [{
          id: + new Date(),
          isActive: true,
          points: [{
            id: + new Date(),
            isSelected: true,
            ...payload
          }]
        }])]
      }

      case SELECT_POINT: return {
        ...state,
        polyLines: state.polyLines.map(pl => {
          if (pl.id === payload.lineId){
            return {
              ...pl,
              isActive: true,
              points: pl.points.map(pt => {
                if (pt.id === payload.pointId){
                  return {
                    ...pt,
                    isSelected: true
                  }
                }
                return {
                  ...pt,
                  isSelected: false
                }
              })
            }
          }
          return {
            ...pl,
            isActive: false
          }
        })
      }

      case DESELECT_POLYLINES: return {
        ...state,
        polyLines: state.polyLines.map(pl => ({
          ...pl,
          isActive: false
        }))
      }

      case SELECT_POLYLINE: return {
        ...state,
        polyLines: state.polyLines.map(p => ({
          ...p,
          isActive: p.id === payload
        }))
      }

      case REMOVE_SELECTED_POLYLINE: return {
        ...state,
        polyLines: state.polyLines.filter(({ isActive }) => !isActive)
      }

      case TOGGLE_DRAWING: return {
        ...state,
        isDrawing: !state.isDrawing
      }

      case RESET_POLYLINES: return {
        ...state,
        polyLines: initialState.polyLines
      }

      case ADD_POLYLINES_JSON: 
        try {
          return {
            ...state,
            polyLines: JSON.parse(payload)
          }
        } catch(e){
          return state
        }

      case MOVE_ACTIVE_POINT: return {
        ...state,
        polyLines: state.polyLines.map(pl => {
          if (pl.isActive) {
            return {
              ...pl,
              points: pl.points.map(pt => {
                if (pt.isSelected === true) {
                  return {
                    ...pt,
                    ...getNextLatLng(pt, payload)
                  }
                }
                return pt
              })
            }
          }
          return pl
        })      
      }

      case DELETE_ACTIVE_POINT: return {
        ...state,
        polyLines: state.polyLines.map(pl => {
          if (pl.isActive) {
            return {
              ...pl,
              points: pl.points.filter(({ isSelected }) => !isSelected)
            }
          }
          return pl
        })        
      }

      case COPY_POINT: return {
        ...state,
        copiedPoints: [
          ...state.copiedPoints,
          getActivePointCoordinates({ polyLines: state.polyLines })
        ]
      }

      case EDIT_COPIED_POINTS_JSON: return {
        ...state,
        copiedPoints: JSON.parse(payload)
      }

      case ADD_SZK_TO_AREA: return {
        ...state,
        activeArea: {
          ...state.activeArea,
          properties: {
            ...(state.activeArea.properties || {}),
            szavazokorok: toggleToActiveAreaSzks(state, payload)
          }
        }
      }

      default: return state
    }
  } catch(error){
    console.log(error)
    return state
  }
}

export default reducer
