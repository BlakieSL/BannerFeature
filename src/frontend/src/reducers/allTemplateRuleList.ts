import {SET_TEMPLATE_RULE_LIST} from "../constants/ActionTypes";
import {setAllTemplateRuleList} from "../actions/actions";
import {TemplateRule} from "../model/interfaces";

const allTemplateRuleList = (state = null, action: setAllTemplateRuleList): Array<TemplateRule>|null => {
    switch (action.type) {
        case SET_TEMPLATE_RULE_LIST: return action.templateRuleList
        default: return state
    }
}

export default allTemplateRuleList