import * as actionTypes from '../constants/ActionTypes'

const activeOrderSupply = (state = null, action) => {
    switch (action.type) {
        case actionTypes.SET_ACTIVE_ORDER_SUPPLY:
            return action.orderSupply
        default:
            return state
    }
}

export default activeOrderSupply