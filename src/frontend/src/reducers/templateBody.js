import {SET_TEMPLATE_BODY} from "../constants/ActionTypes";

const templateBody = (state = null, action) => {
    switch (action.type) {
        case SET_TEMPLATE_BODY: return action.templateBody
        default: return state
    }
}

export default templateBody