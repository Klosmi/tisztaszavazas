export const ADD_TO_OEVK = 'ADD_TO_OEVK'

export const initialState = {
  settlementOevk: {
    'Erdőhorváti': ['borsod', 1]
  }
}

const reducer = (state, { type, payload }) => {
  switch(type){
    case ADD_TO_OEVK: return {
      ...state
    }
    default: return state
  }
}

export default reducer
