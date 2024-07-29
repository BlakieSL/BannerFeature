import * as actionTypes from '../constants/ActionTypes'

const dateRefreshWaresInventList = (state = null, action) => {
    switch (action.type) {
        case actionTypes.REFRESH_WARES_INVENT_LIST:
            return action.dateRefreshWaresInventList
        default:
            return state
    }
}

export default dateRefreshWaresInventList