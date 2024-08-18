import axios from "axios";
import {SET_BANNERS, SET_CHANNELS, SET_STATUSES} from "../constants/ActionTypes";

export const fetchStatuses = () => async dispatch => {
    try {
        const response = await axios.get('/api/designations/status')
        dispatch({ type: SET_STATUSES, payload: response.data });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            dispatch({ type: SET_STATUSES, payload: [] });
        } else {
            console.error('Error fetching statuses:', error);
        }
    }
}

export const fetchChannels = () => async dispatch => {
    try {
        const response = await axios.get('/api/designations/channel')
        dispatch({ type: SET_CHANNELS, payload: response.data });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            dispatch({ type: SET_CHANNELS, payload: [] });
        } else {
            console.error('Error fetching channels:', error);
        }
    }
}