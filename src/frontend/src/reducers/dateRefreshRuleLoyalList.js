import * as actionTypes from '../constants/ActionTypes'

const dateRefreshRuleLoyalList = (state = null, action) => {
    switch (action.type) {
        case actionTypes.REFRESH_RULE_LOYAL_LIST:
            return action.dateRefreshRuleLoyalList
        default:
            return state
    }
}

export default dateRefreshRuleLoyalList