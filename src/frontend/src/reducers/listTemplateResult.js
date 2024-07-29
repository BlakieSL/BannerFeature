import {SET_LIST_TEMPLATE_RESULT} from "../constants/ActionTypes";

const listTemplateResult = (state = null, action) => {
    switch (action.type) {
        case SET_LIST_TEMPLATE_RESULT: return action.listTemplateResult
        default: return state
    }
}

export default listTemplateResult