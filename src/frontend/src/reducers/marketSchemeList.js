import {SET_MARKET_SCHEME_LIST} from "../constants/ActionTypes";

const marketSchemeList = (state = null, action) => {
    switch (action.type) {
        case SET_MARKET_SCHEME_LIST: return action.marketSchemeList
        default: return state
    }
}

export default marketSchemeList