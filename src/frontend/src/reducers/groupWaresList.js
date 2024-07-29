import {SET_GROUP_WARES_LIST} from "../constants/ActionTypes";

const groupWaresList = (state = null, action) => {
    switch (action.type) {
        case SET_GROUP_WARES_LIST: return action.groupWaresList
        default: return state
    }
}

export default groupWaresList