import {
    SET_BANNER,
} from '../constants/ActionTypes';

const initialState = {
    selectedBanner: null,
};

const currentBannerReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_BANNER:
            return {
                ...state,
                selectedBanner: action.payload,
            };
        default:
            return state;
    }
};

export default currentBannerReducer;
