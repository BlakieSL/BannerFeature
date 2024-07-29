import {SET_LIST_TEMPLATE_BODY} from "../constants/ActionTypes";

const listTemplateBody = (state = null, action) => {
    switch (action.type) {
        case SET_LIST_TEMPLATE_BODY: return action.listTemplateBody
        default: return state
    }
}

export default listTemplateBody