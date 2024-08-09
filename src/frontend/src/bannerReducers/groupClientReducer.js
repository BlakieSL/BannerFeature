import { SET_GROUP_CLIENTS } from '../constants/ActionTypes';

const initialState = {
    groupClients: [],
};

const groupClientReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_GROUP_CLIENTS:
            return {
                ...state,
                groupClients: action.payload,
            };
        default:
            return state;
    }
};

export default groupClientReducer;
