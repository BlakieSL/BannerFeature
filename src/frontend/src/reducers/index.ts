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
import bannerListReducer from "../bannerReducers/bannerListReducer";
import clientListReducer from "../bannerReducers/clientReducer";
import currentBannerReducer from "../bannerReducers/currentBannerReducer";
import groupBannerListReducer from "../bannerReducers/groupBannerReducer";
import groupClientListReducer from "../bannerReducers/groupClientReducer";
import currentGroupBannerReducer from "../bannerReducers/currentGroupBannerReducer";
import clientReducer from "../bannerReducers/clientReducer";
import groupBannerReducer from "../bannerReducers/groupBannerReducer";
import groupClientReducer from "../bannerReducers/groupClientReducer";
import selectedClientsReducer from "../bannerReducers/selectedClientsReducer";
import selectedGroupClientsReducer from "../bannerReducers/selectedGroupClientsReducer";
import typeBannerReducer from "../bannerReducers/typeBannerReducer";
import statusListReducer from "../bannerReducers/statusListReducer";
import channelListReducer from "../bannerReducers/channelListReducer";
import imageListReducer from "../bannerReducers/imageListReducer";

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
    allTemplateRuleList: allTemplateRuleList,
    bannerListReducer: bannerListReducer,
    clientReducer: clientReducer,
    currentBannerReducer: currentBannerReducer,
    groupBannerReducer: groupBannerReducer,
    groupClientReducer: groupClientReducer,
    currentGroupBannerReducer: currentGroupBannerReducer,
    selectedClientsReducer: selectedClientsReducer,
    selectedGroupClientsReducer: selectedGroupClientsReducer,
    typeBannerReducer: typeBannerReducer,
    statusListReducer: statusListReducer,
    channelListReducer: channelListReducer,
    imageListReducer: imageListReducer,
})

export default rootReducer
export type State = ReturnType<typeof rootReducer>;