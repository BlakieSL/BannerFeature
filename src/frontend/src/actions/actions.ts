import {Condition, DiscountGroup, DynamicList, TemplateRule} from "../model/interfaces";

export const setDiscountGroupList = (actionType: string, discountGroupList: Array<DiscountGroup>) => ({
    type: actionType, discountGroupList: discountGroupList
})
export type setDiscountGroupListType = ReturnType<typeof setDiscountGroupList>;

export const setDynamicLists = (actionType: string, dynamicLists: Array<DynamicList>) => ({
    type: actionType, dynamicLists: dynamicLists
})
export type setDynamicListsType = ReturnType<typeof setDynamicLists>

export const setConditionLists = (actionType: string, conditionLists: Array<Condition>) => ({
    type: actionType, conditionLists: conditionLists
})
export type setConditionListsType = ReturnType<typeof setConditionLists>

export const setAllTemplateRuleList = (actionType: string, templateRuleList: Array<TemplateRule>) => ({
    type: actionType, templateRuleList: templateRuleList
})
export type setAllTemplateRuleList = ReturnType<typeof setAllTemplateRuleList>

