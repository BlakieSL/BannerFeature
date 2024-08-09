import { SET_GROUP_BANNERS } from '../constants/ActionTypes';

const initialState = {
    groupBanners: [],
};

const groupBannerReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_GROUP_BANNERS:
            return {
                ...state,
                groupBanners: action.payload,
            };
        default:
            return state;
    }
};

export default groupBannerReducer;
