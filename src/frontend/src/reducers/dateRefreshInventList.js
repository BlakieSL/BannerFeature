import * as actionTypes from '../constants/ActionTypes'

const dateRefreshInventList = (state = null, action) => {
    switch (action.type) {
        case actionTypes.REFRESH_INVENT_LIST:
            return action.dateRefreshInventList
        default:
            return state
    }
}

export default dateRefreshInventList