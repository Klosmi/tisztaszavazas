export const TOGGLE_SETTLEMENT_TO_OEVK = 'TOGGLE_SETTLEMENT_TO_OEVK'
export const TOGGLE_ACTIVE_SETTLEMENT = 'TOGGLE_ACTIVE_SETTLEMENT'

export const initialState = {
  activeSettlement: null,
  lastActiveOevkId: '8|1',
  allSettlements: [],
  countiesAndOevks: [],
  szavazatokTelepulesenkent: {},
  settlementOevkGroupping: {},
}

const getOevkAggregations = ({
  settlementOevkGroupping,
  szavazatokTelepulesenkent,
  votersNumberDataObject,
}) => {
  const oevkAggregations = {}

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

    oevkAggregations[oevkId] = {
      ellenzek: (oevkAggregations[oevkId]?.ellenzek || 0) + ellenzek,
      fidesz: (oevkAggregations[oevkId]?.fidesz || 0) + fidesz,
      osszes: (oevkAggregations[oevkId]?.osszes || 0) + osszes,
      valasztokSzama: (oevkAggregations[oevkId]?.valasztokSzama || 0) + valasztokSzama,
    }
  }

  return oevkAggregations
}

const getActiveCountyOevkData = ({
  activeSettlementVotersNumer,
  countiesAndOevksObject
}) => {
  const activeCountyOevkData = countiesAndOevksObject[activeSettlementVotersNumer?.megyeKod]
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

  const oevkAggregations = getOevkAggregations({
    settlementOevkGroupping: state.settlementOevkGroupping,
    szavazatokTelepulesenkent: state.szavazatokTelepulesenkent,
    votersNumberDataObject: state.votersNumberDataObject,
    // selectedOevkId: state.
  })

  const activeCountyOevkData = getActiveCountyOevkData({
    activeSettlementVotersNumer,
    countiesAndOevksObject: state.countiesAndOevksObject,
  })


  const activeSettlementOevkId = getActiveSettlementOevkId({
    settlementOevkGroupping: state.settlementOevkGroupping,
    activeSettlement: state.activeSettlement,
  })


  const winnedOevks = getWinnedOevks({
    oevkAggregations
  })

  return {
    activeSettlement: state.activeSettlement,
    allSettlements: state.allSettlements,
    activeSettlementVotersNumer,
    activeSettlementOevkId,
    oevkAggregations,
    activeCountyOevkData,
    winnedOevks,
    settlementOevkGroupping: state.settlementOevkGroupping,
    lastActiveOevkId: state.lastActiveOevkId
  }
}

const getGroupping = (state, { oevkId }) => {
  const settlementName = state.activeSettlement.name

  const oevkIdArr = oevkId.split('|').map(n => parseInt(n))
  console.log({oevkId})

  return {
    ...(oevkId ? { lastActiveOevkId: oevkId } : {}),
    settlementOevkGroupping: {
      ...state.settlementOevkGroupping,
      [settlementName]: oevkIdArr
    }
  }
}

const setActiveSettlement = (state, payload) => {
  const activeSettlement = state.allSettlements.features.find(({ _id }) => _id === payload.settlementId) || null,
  // if (!activeSettlement) return null

  const l = {}

  if (activeSettlement){
    const oevkId = state.settlementOevkGroupping[activeSettlement.name]
    const isInTheSameCountry = activeSettlement.megyeKod && activeSettlement.megyeKod === state.lastActiveOevkId.split('|')[0]
    if (oevkId || !isInTheSameCountry) {
      l = {lastActiveOevkId: null}
    }
  }

  return {
    activeSettlement,
    ...l
  }


  // const activeSettlement.name
}

const reducer = (state, { type, payload }) => {
  // console.log(payload)
  switch(type){
    case TOGGLE_SETTLEMENT_TO_OEVK: return {
      ...state,
      ...getGroupping(state, payload)
    }
    case TOGGLE_ACTIVE_SETTLEMENT: return {
      ...state,
      ...setActiveSettlement(state, payload),
      // lastActiveOevkId: getLastActiveOevkId(state, payload),
      
    }
    default: return state
  }
}

export default reducer
