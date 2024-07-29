import {SET_LIST_TYPE_VALUE} from "../constants/ActionTypes";

const listTypeValue = (state = null, action) => {
    switch (action.type) {
        case SET_LIST_TYPE_VALUE: return action.listTypeValue
        default: return state
    }
}

export default listTypeValue