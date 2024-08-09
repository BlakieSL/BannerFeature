import axios from 'axios';
import {
    SET_BANNERS,
    SET_BANNER,
} from '../constants/ActionTypes';

export const fetchBanners = () => async dispatch => {
    try {
        const response = await axios.get('/api/banners');
        dispatch({ type: SET_BANNERS, payload: response.data });
    } catch (error) {
        console.error('Error fetching banners:', error);
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

export const fetchBannersByGroup = (codeGroupBanner) => async dispatch => {
    try {
        const response = await axios.get(`/api/banners/group/${codeGroupBanner}`);
        dispatch({ type: SET_BANNERS, payload: response.data });
    } catch (error) {
        console.error('Error fetching banners by group:', error);
    }
};

export const filterBanners = (filter) => async dispatch => {
    try {
        const response = await axios.post('/api/banners/filter', filter);
        dispatch({ type: SET_BANNERS, payload: response.data });
    } catch (error) {
        console.error('Error filtering banners:', error);
    }
};

export const createBanner = (banner) => async dispatch => {
    try {
        await axios.post('/api/banners', banner);
        dispatch(fetchBanners());
    } catch (error) {
        console.error('Error creating banner:', error);
    }
};

export const updateBanner = (id, patch) => async dispatch => {
    try {
        await axios.patch(`/api/banners/${id}`, patch);
        dispatch(fetchBanners());
    } catch (error) {
        console.error('Error updating banner:', error);
    }
};

export const deleteBanner = (id) => async dispatch => {
    try {
        await axios.delete(`/api/banners/${id}`);
        dispatch(fetchBanners());
    } catch (error) {
        console.error('Error deleting banner:', error);
    }
};

export const moveBanner = (id, codeGroupBanner) => async dispatch => {
    try {
        await axios.put(`/api/banners/${id}/move/${codeGroupBanner}`);
        dispatch(fetchBanners());
    } catch (error) {
        console.error('Error moving banner:', error);
    }
};

export const copyBanner = (id, targetCodeGroupBanner) => async dispatch => {
    try {
        await axios.post(`/api/banners/${id}/copy/${targetCodeGroupBanner}`);
        dispatch(fetchBanners());
    } catch (error) {
        console.error('Error copying banner:', error);
    }
};
