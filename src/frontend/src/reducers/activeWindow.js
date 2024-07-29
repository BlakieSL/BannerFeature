import * as actionTypes from '../constants/ActionTypes'
import {INVOICE} from "../constants/WindowsTypes";

const activeWindow = (state = INVOICE, action) => {
    switch (action.type) {
        case actionTypes.SET_ACTIVE_WINDOW:
            return action.windowType
        default:
            return state
    }
}

export default activeWindow