import axios from 'axios';
import {SET_GROUP_CLIENT, SET_GROUP_CLIENTS} from "../constants/ActionTypes";

export const fetchGroupClients = () => async dispatch => {
    try {
        const response = await axios.get('/api/group-clients');
        dispatch({type: SET_GROUP_CLIENTS, payload: response.data});
    } catch (error) {
        console.error('Error fetching groupClients:', error);
    }
}

export const fetchGroupClient = (id) => async dispatch => {
    try{
        const response = await axios.get(`/api/group-clients/${id}`);
        dispatch({type: SET_GROUP_CLIENT, payload: response.data });
    } catch(error) {
        console.log('Error fetching groupClient:', error);
    }
}