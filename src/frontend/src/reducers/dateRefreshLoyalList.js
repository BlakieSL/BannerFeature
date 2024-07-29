import * as actionTypes from '../constants/ActionTypes'

const dateRefreshLoyalList = (state = null, action) => {
    switch (action.type) {
        case actionTypes.REFRESH_LOYAL_LIST:
            return action.dateRefreshLoyalList
        default:
            return state
    }
}

export default dateRefreshLoyalList