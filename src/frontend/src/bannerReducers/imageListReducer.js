import {
    ADD_PENDING_IMAGE,
    CLEAR_IMAGES, MARK_IMAGES_FOR_DELETION,
    REMOVE_PENDING_IMAGE,
    SET_BANNER_IMAGES,
    SET_BANNERS,
    SET_IMAGES
} from "../constants/ActionTypes";

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
        case MARK_IMAGES_FOR_DELETION:
            return {
                ...state,
                bannerImages: state.bannerImages.filter(img => !action.payload.includes(img.codeImage)),
            }
        default:
            return state;
    }
}

export default imageListReducer;