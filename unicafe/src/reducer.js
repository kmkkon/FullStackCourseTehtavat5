/* eslint-disable default-case */
const initialState = {
    good: 0,
    ok: 0,
    bad: 0
  }
  
  const counterReducer = (state = initialState, action) => {
    if (state.good === undefined |state.ok === undefined |state.bad === undefined){ //melko varmasti päin honkia fixattu, mutta jos ei oo statea, niin ei oo goodiakaan...
        console.log("undefined")
        return initialState
    }
    switch (action.type) {
      case 'GOOD':
        return {...state, good: state.good+1}
      case 'OK':
        return {...state, ok: state.ok+1}
      case 'BAD':
        return {...state, bad: state.bad+1}
      case 'ZERO':
        return initialState
    }
    return state
  }
  
  export default counterReducer