import {SET_DISCOUNT_GROUP_LIST} from "../constants/ActionTypes";
import {setDiscountGroupListType} from "../actions/actions";
import {DiscountGroup} from "../model/interfaces";

const discountGroupList = (state = null, action: setDiscountGroupListType): Array<DiscountGroup>|null => {
    switch (action.type) {
        case SET_DISCOUNT_GROUP_LIST: return action.discountGroupList
        default: return state
    }
}

export default discountGroupList