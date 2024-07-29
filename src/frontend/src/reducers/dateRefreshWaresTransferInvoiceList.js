import * as actionTypes from '../constants/ActionTypes'

const dateRefreshWaresTransferInvoiceList = (state = null, action) => {
    switch (action.type) {
        case actionTypes.REFRESH_WARES_TRANSFER_INVOICE_LIST:
            return action.dateRefreshWaresTransferInvoiceList
        default:
            return state
    }
}

export default dateRefreshWaresTransferInvoiceList