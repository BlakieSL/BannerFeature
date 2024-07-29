import {setConditionListsType} from "../actions/actions";
import {SET_CONDITION_LISTS} from "../constants/ActionTypes";
import {Condition} from "../model/interfaces";

const conditionLists = (state = null, action: setConditionListsType): Array<Condition> | null => {
    switch(action.type) {
        case SET_CONDITION_LISTS: return action.conditionLists
        default: return state
    }
}

export default conditionLists