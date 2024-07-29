import {SET_LIST_SHOPS} from "../constants/ActionTypes";

const listShops = (state = null, action) => {
    switch (action.type) {
        case SET_LIST_SHOPS: return action.listShops
        default: return state
    }
}

export default listShops