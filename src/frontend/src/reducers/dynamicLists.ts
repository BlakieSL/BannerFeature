import {setDynamicListsType} from "../actions/actions";
import {DynamicList} from "../model/interfaces";
import {SET_DYNAMIC_LISTS} from "../constants/ActionTypes";

const dynamicLists = (state = null, action: setDynamicListsType ): Array<DynamicList> | null => {
    switch (action.type) {
        case SET_DYNAMIC_LISTS: return action.dynamicLists
        default: return state
    }
}

export default dynamicLists