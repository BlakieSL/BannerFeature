import {SET_ACCESS_EVENT_LIST} from "../constants/ActionTypes";

const accessEventList = (state = null, action) => {
    switch (action.type) {
        case SET_ACCESS_EVENT_LIST: return action.accessEventList
        default: return state
    }
}

export default accessEventList