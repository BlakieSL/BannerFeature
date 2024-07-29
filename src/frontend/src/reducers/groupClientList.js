import {SET_GROUP_CLIENT_LIST} from "../constants/ActionTypes";

const groupClientList = (state = null, action) => {
    switch (action.type) {
        case SET_GROUP_CLIENT_LIST: return action.groupClientList
        default: return state
    }
}

export default groupClientList