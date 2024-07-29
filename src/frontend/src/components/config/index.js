export const CODE_SHOP = sessionStorage.getItem("codeShop")
export const ID_WORKPLACE = sessionStorage.getItem("idWorkplace")
export const USER_POS = JSON.parse(sessionStorage.getItem('userPos'))
export const CODE_USER = USER_POS?.codeUser
export const FULL_NAME = USER_POS?.fio
export const VERSION = sessionStorage.getItem('version')

