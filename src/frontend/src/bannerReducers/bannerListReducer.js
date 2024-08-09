import {
    SET_BANNERS,
} from '../constants/ActionTypes';

const initialState = {
    banners: [],
};

const bannerListReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_BANNERS:
            return {
                ...state,
                banners: action.payload,
            };
        default:
            return state;
    }
};

export default bannerListReducer;
