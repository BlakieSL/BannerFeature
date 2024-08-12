import { SET_CLIENT } from "../constants/ActionTypes";
import { Client, SelectedClientsState } from "../types";

interface SetClientAction {
    type: typeof SET_CLIENT;
    payload: Client;
}

type SelectedClientsActionTypes = SetClientAction;

const initialState: SelectedClientsState = {
    clients: [],
};

const selectedClientsReducer = (
    state = initialState,
    action: SelectedClientsActionTypes
): SelectedClientsState => {
    switch(action.type) {
        case SET_CLIENT:
            return {
                ...state,
                clients: [...state.clients, action.payload],
            };
        default:
            return state;
    }
}

export default selectedClientsReducer;
