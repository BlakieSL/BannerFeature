import {SET_LIST_TEMPLATE_CONDITION} from "../constants/ActionTypes";

const listTemplateCondition = (state = null, action) => {
    switch (action.type) {
        case SET_LIST_TEMPLATE_CONDITION: return action.listTemplateCondition
        default: return state
    }
}

export default listTemplateCondition