export const TOGGLE_SETTLEMENT_TO_OEVK = 'TOGGLE_SETTLEMENT_TO_OEVK'
export const TOGGLE_ACTIVE_SETTLEMENT = 'TOGGLE_ACTIVE_SETTLEMENT'

export const initialState = {
  activeSettlement: null,
  allSettlements: [],
  countiesAndOevks: [],
  settlementOevkGroupping: {
    'Hejő': [5, 1],
    'Keszi': [5, 1],
  },

}

export const mapStateToValues = state => {
  const activeSettlementVotersNumer = (
    state.
    votersNumberDataObject?.
    [state.activeSettlement?.name]
  ) || {}


  // const oevkAggregations = {}

  // for (const [countryCode, oevkNum] of Object.values(settlementOevkGroupping)) {
  //   countiesAndOevks.find(({ megyeKod }) => megyeKod === countryCode)
  // }

  const oevkAggregations = {
    'Borsod-Abaúj-Zemplén|1': { fidesz: 556, ellenzek: 334 },
  }

  return {
    activeSettlement: state.activeSettlement,
    allSettlements: state.allSettlements,
    activeSettlementVotersNumer,
    oevkAggregations,
  }
}

const getGroupping = (state, payload) => {
  const settlementName = state.activeSettlement.name
  const countryCode = state.votersNumberDataObject[settlementName].megyeKod
  const oevkNum = payload.oevkNum

  return ({
    ...state.settlementOevkGroupping,
    [settlementName]: [countryCode, oevkNum]
  })
}

const reducer = (state, { type, payload }) => {
  switch(type){
    case TOGGLE_SETTLEMENT_TO_OEVK: return {
      ...state,
      settlementOevkGroupping: getGroupping(state, payload)
    }
    case TOGGLE_ACTIVE_SETTLEMENT: return {
      ...state,
      activeSettlement: state.allSettlements.features.find(({ _id }) => _id === payload.settlementId) || null,
    }
    default: return state
  }
}

export default reducer
