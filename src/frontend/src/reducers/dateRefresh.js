import * as actionTypes from '../constants/ActionTypes'

const dateRefresh = (state = null, action) => {
    switch (action.type) {
        case actionTypes.REFRESH_INVOICE_LIST:
            return action.dateRefreshInvoiceList
        case actionTypes.REFRESH_EDIT_INVOICE_FORM:
            return action.dateRefreshEditInvoiceForm
        case actionTypes.REFRESH_WARES_INVOICE_LIST:
            return action.dateRefreshWaresInvoiceList
        default:
            return state
    }
}

export default dateRefresh