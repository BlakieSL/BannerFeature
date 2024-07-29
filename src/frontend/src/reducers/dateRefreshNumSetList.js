import * as actionTypes from '../constants/ActionTypes'

const dateRefreshNumSetList = (state = null, action) => {
    switch (action.type) {
        case actionTypes.REFRESH_NUM_SET_LIST:
            return action.dateRefreshNumSetList
        default:
            return state
    }
}

export default dateRefreshNumSetList