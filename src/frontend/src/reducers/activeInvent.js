import * as actionTypes from '../constants/ActionTypes'

const activeInvent = (state = null, action) => {
    switch (action.type) {
        case actionTypes.SET_ACTIVE_INVENT:
            return action.invent
        default:
            return state
    }
}

export default activeInvent