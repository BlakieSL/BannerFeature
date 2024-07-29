import {SET_TYPE_ORDER_LIST} from "../constants/ActionTypes";

const typeOrderList = (state = null, action) => {
    switch (action.type) {
        case SET_TYPE_ORDER_LIST: return action.typeOrderList
        default: return state
    }
}

export default typeOrderList