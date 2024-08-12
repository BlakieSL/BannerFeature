import {
    SET_CLIENTS,
    SET_CLIENT_BY_PHONE,
    SET_CLIENTS_BY_BARCODES
} from '../constants/ActionTypes';

const initialState = {
    clients: [],
};

const clientReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CLIENTS:
            return {
                ...state,
                clients: action.payload,
            };
        case SET_CLIENT_BY_PHONE:
            return {
                ...state,
                clients: [action.payload],
            };
        case SET_CLIENTS_BY_BARCODES:
            return {
                ...state,
                clients: action.payload,
            };
        default:
            return state;
    }
};

export default clientReducer;
