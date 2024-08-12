import { SET_GROUP_CLIENT } from "../constants/ActionTypes";
import { GroupClient, SelectedGroupClientsState } from "../types";

interface SetGroupClientAction {
    type: typeof SET_GROUP_CLIENT;
    payload: GroupClient;
}

type SelectedGroupClientsActionTypes = SetGroupClientAction;

const initialState: SelectedGroupClientsState = {
    groupClients: [],
};

const selectedGroupClientsReducer = (
    state = initialState,
    action: SelectedGroupClientsActionTypes
): SelectedGroupClientsState => {
    switch(action.type) {
        case SET_GROUP_CLIENT:
            return {
                ...state,
                groupClients: [...state.groupClients, action.payload],
            };
        default:
            return state;
    }
}

export default selectedGroupClientsReducer;
