import * as actionTypes from '../constants/ActionTypes'

const dateRefreshOrderSupplyList = (state = null, action) => {
    switch (action.type) {
        case actionTypes.REFRESH_ORDER_SUPPLY_LIST:
            return action.dateRefreshOrderSupplyList
        default:
            return state
    }
}

export default dateRefreshOrderSupplyList