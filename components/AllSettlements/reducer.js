export const TOGGLE_SETTLEMENT_TO_OEVK = 'TOGGLE_SETTLEMENT_TO_OEVK'
export const TOGGLE_ACTIVE_SETTLEMENT = 'TOGGLE_ACTIVE_SETTLEMENT'
export const TOGGLE_ACTIVE_CITY_SZK = 'TOGGLE_ACTIVE_CITY_SZK'
export const TOGGLE_CITY_SZK_TO_OEVK = 'TOGGLE_CITY_SZK_TO_OEVK'

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
      } = votersNumberDataObject[settlementName]

      const oevkId = `${countyCode}|${oevkNum}`

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
      } = cityVotersNumberObject[citySzkId]

      const oevkId = `${countyCode}|${oevkNum}`
      
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
  activeSzk
}) => {

  const activeCountyOevkData = (
    activeSzk ? 
    countiesAndOevksObject[activeSzk.megyeKod] : 
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
    join('|')
  )
  return activeSettlementOevkId
}


const getActiveSzkOevkId = ({
  citySzkOevkGroupping,
  activeSzkId,
}) => {
  const activeSzkOevkId = (
    citySzkOevkGroupping[activeSzkId]
    ?.join('|')
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
    activeAdminUnitName: activeSettlement?.name || activeSzk?.citySzkId,
    activeOevkId: activeSettlementOevkId || activeSzkOevkId
  }
}

const getGroupping = (state, { oevkId }) => {
  const settlementName = state.activeSettlement?.name || state.activeSzk?.citySzkId

  return ({
    ...state.settlementOevkGroupping,
    [settlementName]: oevkId.split('|').map(n => parseInt(n))
  })
}

const getSzkGroupping = (state, { oevkId }) => {
  const { citySzkId } = state.activeSzk
  return {
    ...state.citySzkOevkGroupping,
    [citySzkId]: oevkId.split('|').map(n => parseInt(n))
  }
}

const reducer = (state, { type, payload }) => {
  console.log(payload)
  switch(type){
    case TOGGLE_SETTLEMENT_TO_OEVK: return {
      ...state,
      settlementOevkGroupping: getGroupping(state, payload)
    }
    case TOGGLE_CITY_SZK_TO_OEVK: return {
      ...state,
      citySzkOevkGroupping: getSzkGroupping(state, payload)
    }
    case TOGGLE_ACTIVE_SETTLEMENT: return {
      ...state,
      activeSzk: null,
      activeSettlement: state.allSettlements.features.find(({ _id }) => _id === payload.settlementId) || null,
    }
    case TOGGLE_ACTIVE_CITY_SZK: return {
      ...state,
      activeSettlement: null,
      activeSzk: state.cityVotersNumberObject[payload.citySzkId] || null,
    }
    default: return state
  }
}

export default reducer
