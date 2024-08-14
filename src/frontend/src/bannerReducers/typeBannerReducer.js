import { SET_TYPE_BANNERS } from "../constants/ActionTypes";

const initialState = {
    typeBanners: [],
};

const typeBannerReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_TYPE_BANNERS:
            return {
                ...state,
                typeBanners: action.payload,
            };
        default:
            return state;
    }
};
export default typeBannerReducer;