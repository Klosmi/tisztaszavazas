export const ADD_TO_OEVK = 'ADD_TO_OEVK'
export const TOGGLE_ACTIVE_SETTLEMENT = 'TOGGLE_ACTIVE_SETTLEMENT'

export const initialState = {
  activeSettlement: null,
  allSettlements: [],
  settlementOevk: {
    'Erdőhorváti': ['borsod', 1]
  }
}

export const mapStateToValues = state => {
  return {
    activeSettlement: state.activeSettlement,
    allSettlements: state.allSettlements
  }
}

const reducer = (state, { type, payload }) => {
  switch(type){
    case ADD_TO_OEVK: return {
      ...state
    }
    case TOGGLE_ACTIVE_SETTLEMENT: return {
      // const settlement = allSettlements.features.find(({ _id }) => _id === settlementId)      
      ...state
    }
    default: return state
  }
}

export default reducer
