import { SET_GROUP_BANNER} from "../constants/ActionTypes";

const initialState = {
    groupBannerDetails: {},
}

const currentGroupBannerReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_GROUP_BANNER:
            return {
                ...state,
                groupBannerDetails: action.payload
            }
        default:
            return state;
    }
}

export default currentGroupBannerReducer;