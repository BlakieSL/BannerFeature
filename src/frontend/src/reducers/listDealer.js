import {SET_LIST_DEALER} from "../constants/ActionTypes";

const listDealer = (state = null, action) => {
    switch (action.type) {
        case SET_LIST_DEALER: return action.listDealer
        default: return state
    }
}

export default listDealer