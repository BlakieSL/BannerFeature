import axios from 'axios';
import {
    SET_CLIENT_BY_PHONE,
    SET_CLIENTS_BY_BARCODES,
    CLEAR_CLIENTS
} from '../constants/ActionTypes';

export const findClientByPhone = (phoneDto) => async dispatch => {
    try {
        const response = await axios.post('/api/clients/find-by-phone', phoneDto);
        dispatch({ type: SET_CLIENT_BY_PHONE, payload: response.data });
    } catch (error) {
        console.error('Error finding client by phone:', error);
    }
}

export const findClientsByBarcodes = (barcodeDto) => async dispatch => {
    try {
        const response = await axios.post('/api/clients/find-by-barcodes', barcodeDto);
        dispatch({ type: SET_CLIENTS_BY_BARCODES, payload: response.data });
    } catch (error) {
        console.error('Error finding clients by barcodes:', error);
    }
}

export const clearClients = () => ({ type: CLEAR_CLIENTS });