export const TOGGLE_SETTLEMENT_TO_OEVK = 'TOGGLE_SETTLEMENT_TO_OEVK'
export const TOGGLE_ACTIVE_SETTLEMENT = 'TOGGLE_ACTIVE_SETTLEMENT'

export const initialState = {
  activeSettlement: null,
  allSettlements: [],
  countiesAndOevks: [],
  szavazatokTelepulesenkent: {},
  settlementOevkGroupping: {
    'Bajót': [5, 1],
    'Bak': [5, 1],
  },

}

const getOevkAggregations = ({
  settlementOevkGroupping,
  szavazatokTelepulesenkent,
  countiesAndOevks,
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

export const mapStateToValues = state => {
  const activeSettlementVotersNumer = (
    state.
    votersNumberDataObject?.
    [state.activeSettlement?.name]
  ) || {}

  const oevkAggregations = getOevkAggregations({
    settlementOevkGroupping: state.settlementOevkGroupping,
    szavazatokTelepulesenkent: state.szavazatokTelepulesenkent,
    countiesAndOevks: state.countiesAndOevks,
    votersNumberDataObject: state.votersNumberDataObject,
  })

  // const oevkAggregations = {
  //   'Borsod-Abaúj-Zemplén|1': { fidesz: 556, ellenzek: 334 },
  // }

  return {
    activeSettlement: state.activeSettlement,
    allSettlements: state.allSettlements,
    activeSettlementVotersNumer,
    oevkAggregations
  }
}

const getGroupping = (state, payload) => {
  const settlementName = state.activeSettlement.name
  const countyCode = state.votersNumberDataObject[settlementName].megyeKod
  const oevkNum = payload.oevkNum

  return ({
    ...state.settlementOevkGroupping,
    [settlementName]: [countyCode, oevkNum]
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
