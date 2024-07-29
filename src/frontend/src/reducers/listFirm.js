import {SET_LIST_FIRM} from "../constants/ActionTypes";

const listFirm = (state = null, action) => {
    switch (action.type) {
        case SET_LIST_FIRM: return action.listFirm
        default: return state
    }
}

export default listFirm