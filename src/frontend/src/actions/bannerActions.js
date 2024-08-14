import axios from 'axios';
import {
    SET_BANNERS,
    SET_BANNER, CLEAR_BANNER,
} from '../constants/ActionTypes';

export const fetchBanners = () => async dispatch => {
    try {
        const response = await axios.get('/api/banners');
        dispatch({ type: SET_BANNERS, payload: response.data });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            dispatch({ type: SET_BANNERS, payload: [] });
        } else {
            console.error('Error fetching banners:', error);
        }
    }
};

export const fetchBannerById = (id) => async dispatch => {
    try {
        const response = await axios.get(`/api/banners/${id}`);
        dispatch({ type: SET_BANNER, payload: response.data });
    } catch (error) {
        console.error('Error fetching banner by ID:', error);
    }
};

export const clearBanner = () => ({
    type: CLEAR_BANNER,
});

export const fetchBannersByGroup = (codeGroupBanner) => async dispatch => {
    try {
        const response = await axios.get(`/api/banners/group/${codeGroupBanner}`);
        dispatch({ type: SET_BANNERS, payload: response.data });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            dispatch({ type: SET_BANNERS, payload: [] });
        } else {
            console.error('Error fetching banners:', error);
        }
    }
};

export const filterBanners = (filter) => async dispatch => {
    try {
        const response = await axios.post('/api/banners/filter', filter);
        dispatch({ type: SET_BANNERS, payload: response.data });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            dispatch({type: SET_BANNERS, payload: []});
        } else {
            console.error('Error fetching banners:', error);
        }
    }
};

export const createBanner = (banner) => async dispatch => {
    await axios.post('/api/banners', banner);
};

export const updateBanner = (id, patch) => async dispatch => {
    await axios.patch(`/api/banners/${id}`, patch);
};

export const deleteBanner = (id) => async dispatch => {
    await axios.delete(`/api/banners/${id}`);
};

export const deleteBanners = (ids) => async dispatch => {
    const payload = {
        codeBanners: ids
    };

    await axios.delete('/api/banners', {
        data: payload
    });
};

export const moveBanner = (id, codeGroupBanner) => async dispatch => {
    await axios.put(`/api/banners/${id}/move/${codeGroupBanner}`);
};

export const copyBanner = (id, targetCodeGroupBanner) => async dispatch => {
    await axios.post(`/api/banners/${id}/copy/${targetCodeGroupBanner}`);
}

