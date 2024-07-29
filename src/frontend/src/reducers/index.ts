import {combineReducers} from "redux";
import activeWindow from './activeWindow'
import dateRefresh from "./dateRefresh"
import activeInvoice from "./activeInvoice";
import activeLoyal from "./activeLoyal";
import listFirm from "./listFirm";
import listShops from "./listShops";
import listUnitDimension from "./listUnitDimension";
import dateRefreshTransferInvoiceList from "./dateRefreshTransferInvoiceList";
import activeTransferInvoice from "./activeTransferInvoice";
import dateRefreshWaresTransferInvoiceList from "./dateRefreshWaresTransferInvoiceList";
import activeInvent from "./activeInvent";
import dateRefreshInventList from "./dateRefreshInventList";
import dateRefreshLoyalList from "./dateRefreshLoyalList";
import dateRefreshRuleLoyalList from "./dateRefreshRuleLoyalList";
import dateRefreshWaresInventList from "./dateRefreshWaresInventList";
import activeOrderSupply from "./activeOrderSupply";
import dateRefreshOrderSupplyList from "./dateRefreshOrderSupplyList";
import dateRefreshNumSetList from "./dateRefreshNumSetList";
import listTemplateBody from "./listTemplateBody"
import listTemplateResult from "./listTemplateResult";
import ruleTemplateParam from "./ruleTemplateParam";
import templateBody from "./templateBody";
import listTypeValue from "./listTypeValue";
import listDealer from "./listDealer";
import groupWaresList from "./groupWaresList";
import listTemplateCondition from "./listTemplateCondition";
import discountGroupList from "./discountGroupList";
import typeOrderList from "./typeOrderList";
import typeUseList from "./typeUseList";
import groupClientList from "./groupClientList";
import typeDiscountList from "./typeDiscountList";
import marketSchemeList from "./marketSchemeList";
import waresPropertyList from "./waresPropertyList";
import accessEventList from  "./accessEventList";
import dynamicLists from "./dynamicLists";
import conditionLists from "./conditionLists";
import allTemplateRuleList from "./allTemplateRuleList";

const rootReducer = combineReducers({
    activeWindow,
    dateRefreshInvoiceList: dateRefresh,
    dateRefreshEditInvoiceForm: dateRefresh,
    dateRefreshWaresInvoiceList: dateRefresh,
    dateRefreshTransferInvoiceList,
    dateRefreshWaresTransferInvoiceList,
    activeInvoice,
    activeTransferInvoice,
    listFirm,
    listShops,
    listUnitDimension,
    activeInvent,
    activeOrderSupply,
    dateRefreshInventList,
    dateRefreshWaresInventList,
    dateRefreshOrderSupplyList,
    dateRefreshLoyalList,
    dateRefreshRuleLoyalList,
    activeLoyal,
    dateRefreshNumSetList,
    listTemplateBody,
    listTemplateResult,
    ruleTemplateParam,
    templateBody,
    listTypeValue,
    listDealer,
    groupWaresList,
    listTemplateCondition,
    typeOrderList,
    typeUseList,
    groupClientList,
    typeDiscountList,
    marketSchemeList,
    waresPropertyList,
    accessEventList,
    discountGroupList: discountGroupList,
    dynamicLists,
    conditionLists: conditionLists,
    allTemplateRuleList: allTemplateRuleList
})

export default rootReducer
export type State = ReturnType<typeof rootReducer>;