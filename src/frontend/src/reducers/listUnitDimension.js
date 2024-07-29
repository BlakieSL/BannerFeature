import {SET_LIST_UNIT_DIMENSION} from "../constants/ActionTypes";

const listUnitDimension = (state = null, action) => {
    switch (action.type) {
        case SET_LIST_UNIT_DIMENSION: return action.listUnitDimension
        default: return state
    }
}

export default listUnitDimension