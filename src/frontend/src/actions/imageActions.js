import axios from "axios";
import {CLEAR_IMAGES, SET_BANNER_IMAGES, SET_IMAGES} from "../constants/ActionTypes";

export const fetchAllBannersImages = () => async dispatch => {
    try{
        const response = await axios.get('/api/images/type/10');
        dispatch({ type: SET_IMAGES, payload: response.data });
    } catch (error) {
        if(error.response && error.response.status == 404) {
            dispatch({ type: SET_IMAGES, payload: [] });
        } else {
            console.log('Error fetching banners images', error);
        }
    }
}

export const fetchBannerImages = (id) => async dispatch => {
    try {
        const response = await axios.get(`/api/images/type/10/code/${id}`);
        dispatch({type: SET_BANNER_IMAGES, payload: response.data});
    } catch (error) {
        if(error.response && error.response.status == 404) {
            dispatch({ type: SET_BANNER_IMAGES, payload: [] });
        } else {
            console.log('Error fetching images by banner ID:', error);
        }
    }
}

export const createImage = async (typeValue, codeValue, typeRef, imageFile, description = "") => {
    try {
        const formData = new FormData();
        formData.append("typeValue", typeValue);
        formData.append("codeValue", codeValue);
        formData.append("typeRef", typeRef);
        formData.append("imageFile", imageFile);
        if (description) {
            formData.append("description", description);
        }

       await axios.post('/api/images', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

    } catch (error) {
        console.log('Error creating image:', error);
    }
};

export const createMultipleImages = async (typeValue, codeValue, typeRef, imageFiles, description = "") => {
        const formData = new FormData();
        formData.append("typeValue", typeValue);
        formData.append("codeValue", codeValue);
        formData.append("typeRef", typeRef);
        if (description) {
            formData.append("description", description);
        }

        imageFiles.forEach((imageFile) => {
            formData.append(`imageFiles`, imageFile);
        });

        await axios.post('/api/images/multiple', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
};

export const deleteImages = async(ids) => {
    const payload = { codeImages: ids }
    await axios.delete('/api/images', { data: payload })
}

export const clearImages = () => ({
    type: CLEAR_IMAGES
})