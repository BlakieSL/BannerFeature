import {SET_WARES_PROPERTY_LIST} from "../constants/ActionTypes";

const waresPropertyList = (state = null, action) => {
    switch (action.type) {
        case SET_WARES_PROPERTY_LIST: return action.waresPropertyList
        default: return state
    }
}

export default waresPropertyList