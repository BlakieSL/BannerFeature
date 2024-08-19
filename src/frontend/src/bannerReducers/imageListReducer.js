import {CLEAR_IMAGES, SET_BANNER_IMAGES, SET_BANNERS, SET_IMAGES} from "../constants/ActionTypes";

const initialState = {
    allImages: [],
    bannerImages: [],
}

const imageListReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_IMAGES:
            return {
                ...state,
                allImages: action.payload,
            }
        case SET_BANNER_IMAGES:
            return {
                ...state,
                bannerImages: action.payload,
            }
        case CLEAR_IMAGES:
            return {
                ...state,
                bannerImages: [],
            }
        default:
            return state;
    }
}

export default imageListReducer;