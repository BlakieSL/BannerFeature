import {SET_CHANNELS, SET_STATUSES} from "../constants/ActionTypes";

const initialState = {
    channels: [],
}

const channelListReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CHANNELS:
            return{
                ...state,
                channels: action.payload,
            }
        default:
            return state;
    }
}

export default channelListReducer;