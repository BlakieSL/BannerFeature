import {SET_STATUSES} from "../constants/ActionTypes";

const initialState = {
    statuses: [],
}

const statusListReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_STATUSES:
            return {
                ...state,
                statuses: action.payload,
            }
        default:
            return state;
    }
}

export default statusListReducer;