import {SET_TYPE_USE_LIST} from "../constants/ActionTypes";

const typeUseList = (state = null, action) => {
    switch (action.type) {
        case SET_TYPE_USE_LIST: return action.typeUseList
        default: return state
    }
}

export default typeUseList