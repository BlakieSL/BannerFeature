import axios from 'axios'

export const INVOICE = 'INVOICE'
export const WARES_INVOICE = 'WARES_INVOICE'
export const TRANSFER_INVOICE = 'TRANSFER_INVOICE'
export const WARES_TRANSFER_INVOICE = 'WARES_TRANSFER_INVOICE'
export const INVENT = 'INVENT'
export const WARES_INVENT = 'WARES_INVENT'
export const ORDER_SUPPLY = 'ORDER_SUPPLY'
export const WARES_ORDER_SUPPLY = 'WARES_ORDER_SUPPLY'
export const LOYAL = 'LOYAL'
export const RULE_LOYAL = 'RULE_LOYAL'
export const WARES_PROPERTY = 'WARES_PROPERTY'
export const WARES_PROPERTY_ITEMS = 'WARES_PROPERTY_ITEMS'
export const ALT_CATALOG = 'altCatalog'
export const ALT_GROUP = 'altGroup'
export const ALT_ITEM = 'altItem'
export const INTERACTION_RULE = 'interactionRule'
export const DYNAMIC_LISTS = 'dynamicLists'
export const GROUP_COUPON = 'groupCoupon'
export const COUPON = 'coupon'
export const httpClient = axios.create()