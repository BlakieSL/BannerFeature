import * as actionTypes from '../constants/ActionTypes'

const ruleTemplateParam = (state = null, action) => {
    switch (action.type) {
        case actionTypes.SET_RULE_TEMPLATE_PARAM:
            return action.ruleTemplateParam
        default:
            return state
    }
}

export default ruleTemplateParam