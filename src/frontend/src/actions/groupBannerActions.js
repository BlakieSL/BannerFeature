import axios from 'axios';
import {
    SET_GROUP_BANNERS,
    SET_GROUP_BANNER, SET_BANNERS
} from '../constants/ActionTypes';

export const fetchGroupBanners = () => async dispatch => {
    try {
        const response = await axios.get('/api/group-banners');
        dispatch({ type: SET_GROUP_BANNERS, payload: response.data });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            dispatch({ type: SET_GROUP_BANNERS, payload: [] });
        } else {
            console.error('Error fetching group banners:', error);
        }
    }
}

export const fetchGroupBannerById = (id) => async dispatch => {
    try {
        const response = await axios.get(`/api/group-banners/${id}`);
        dispatch({ type: SET_GROUP_BANNER, payload: response.data })
    } catch (error) {
        console.error('Error fetching groupBanner by ID:',error);
    }
}

export const addGroupBanner = (groupBanner) => async dispatch => {
    try {
        await axios.post('/api/group-banners', groupBanner);
        dispatch(fetchGroupBanners());
    } catch (error) {
        console.error('Error adding group banner:', error);
    }
}

export const updateGroupBanner = (id, patch) => async dispatch => {
    try {
        await axios.patch(`/api/group-banners/${id}`, patch);
        dispatch(fetchGroupBanners());
    } catch (error) {
        console.error('Error updating group banner:', error);
    }
}

export const deleteGroupBanner = (id) => async dispatch => {
    try {
        await axios.delete(`/api/group-banners/${id}`);
        dispatch(fetchGroupBanners());
    } catch (error) {
        return error.response.data || 'Error deleting group banner';
    }
}
