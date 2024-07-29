import * as actionTypes from '../constants/ActionTypes'

const activeInvoice = (state = null, action) => {
    switch (action.type) {
        case actionTypes.SET_ACTIVE_INVOICE:
            return action.invoice
        default:
            return state
    }
}

export default activeInvoice