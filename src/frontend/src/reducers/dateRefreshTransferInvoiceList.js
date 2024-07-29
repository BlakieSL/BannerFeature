import * as actionTypes from '../constants/ActionTypes'

const dateRefreshTransferInvoiceList = (state = null, action) => {
    switch (action.type) {
        case actionTypes.REFRESH_TRANSFER_INVOICE_LIST:
            return action.dateRefreshTransferInvoiceList
        default:
            return state
    }
}

export default dateRefreshTransferInvoiceList