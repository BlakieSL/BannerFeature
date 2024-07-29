import * as actionTypes from '../constants/ActionTypes'

const activeLoyal = (state = null, action) => {
    switch (action.type) {
        case actionTypes.SET_ACTIVE_LOYAL:
            return action.loyal
        default:
            return state
    }
}

export default activeLoyal