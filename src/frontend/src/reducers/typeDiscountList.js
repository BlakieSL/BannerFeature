import {SET_LIST_TYPE_DISCOUNT} from "../constants/ActionTypes";

const typeDiscountList = (state = null, action) => {
    switch (action.type) {
        case SET_LIST_TYPE_DISCOUNT: return action.typeDiscountList
        default: return state
    }
}

export default typeDiscountList