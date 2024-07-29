import * as actionTypes from '../constants/ActionTypes'

const activeTransferInvoice = (state = null, action) => {
    switch (action.type) {
        case actionTypes.SET_ACTIVE_TRANSFER_INVOICE:
            return action.transferInvoice
        default:
            return state
    }
}

export default activeTransferInvoice