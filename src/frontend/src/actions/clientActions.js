import axios from 'axios';
import {
    SET_CLIENTS,
    SET_CLIENT_BY_PHONE,
    SET_CLIENTS_BY_BARCODES, SET_GROUP_CLIENT, SET_CLIENT
} from '../constants/ActionTypes';

export const fetchClients = () => async dispatch => {
    try {
        const response = await axios.get('/api/clients');
        dispatch({ type: SET_CLIENTS, payload: response.data });
    } catch (error) {
        console.error('Error fetching clients:', error);
    }
};

export const findClientByPhone = (phoneDto) => async dispatch => {
    try {
        const response = await axios.post('/api/clients/find-by-phone', phoneDto);
        dispatch({ type: SET_CLIENT_BY_PHONE, payload: response.data });
    } catch (error) {
        console.error('Error finding client by phone:', error);
    }
};

export const findClientsByBarcodes = (barcodeDto) => async dispatch => {
    try {
        const response = await axios.post('/api/clients/find-by-barcodes', barcodeDto);
        dispatch({ type: SET_CLIENTS_BY_BARCODES, payload: response.data });
    } catch (error) {
        console.error('Error finding clients by barcodes:', error);
    }
};

export const fetchClient = (id) => async dispatch => {
    try{
        const response = await axios.get(`/api/clients/${id}`);
        dispatch({type: SET_CLIENT, payload: response.data });
    } catch(error) {
        console.log('Error fetching groupClient:', error);
    }
}