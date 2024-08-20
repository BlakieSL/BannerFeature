import {ADD_PENDING_IMAGE, CLEAR_IMAGES, CLEAR_PENDING_IMAGES, REMOVE_PENDING_IMAGE} from "../constants/ActionTypes";


interface PendingImageState {
    pendingImages: {
        codeImage: number;
        image: string;
        file: File;
        isPending: boolean;
    }[];
}

const initialState: PendingImageState = {
    pendingImages: [],
};

const pendingImagesReducer = (state = initialState, action : any): PendingImageState => {
    switch (action.type) {
        case ADD_PENDING_IMAGE:
            return {
                ...state,
                pendingImages: [...state.pendingImages, action.payload],
            };
        case REMOVE_PENDING_IMAGE:
            return {
                ...state,
                pendingImages: state.pendingImages.filter(image => !action.payload.includes(image.codeImage)),
            };
        case CLEAR_PENDING_IMAGES:
            return {
                ...state,
                pendingImages: [],
            };
        default:
            return state;
    }
};

export default pendingImagesReducer;