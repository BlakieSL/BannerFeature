export interface DiscountGroupInteraction {
    xcodeGroup: number
    ycodeGroup: number
    interaction: number
    interactionText: string
}

export interface DiscountGroup {
    codeGroup: number;
    nameGroup: string;
    priority: number;
}

export interface DynamicList {
    codeList: number
    nameList: string
    scriptList: string
    param: string
}

export interface Condition {
    codeCondition: number
    nameCondition: string
    scriptCondition: string
    param: string
}

export interface ConditionRule {
    codeCondition: number,
    param: any
}

export interface RuleDynamicList {
    "nameRule": string,
    "conditions": any
}

export interface Parameter {
    "name": string,
    "description": string,
    "type": string,
    "defaultValue": any | null | undefined,
    "rows": number | null | undefined,
    "detail": string | null | undefined,
    "list": string | null | undefined,
    "codeEvent": number | null | undefined,
    "codeReport": number | null | undefined,
    "required": boolean | null | undefined
}

export interface GroupWares {
    codeGroupWares: number
    codeParentGroupWares: number
    name: string
    signActivity: number
}

export interface Wares {
    codeWares: number
    nameWares: string
    codeGroup: number
    nameGroup: string
    codeBrand: number
    codeUnitBasis: number
    nameUnitBasis: string
    vat: number
    nameWaresReceipt: string
    saleInTara: number
    codeDefaultUnit: number
    nameUnitDefault: string
    vatOperation: number
    nameVatOperation: string
    basisFractional: number
    basisFractionalText: string
    checkedBasisFractional: boolean
    signActivity: number
    signActivityText: string
    checkedSignActivity: boolean
    article: string
    uktved: string
    addInfo: string | null
    addInfoText: string
    langParam: string
}

export interface Property {
    codeProperty: number
    nameProperty: string,
    propertyValueList?: Array<PropertyValue> | null | undefined
    typeValue: number,
    signActivity: number,
    ownProperty: number,
    typeValueText?: string | null | undefined
    ownPropertyText?: string | null | undefined
    signActivityText?: string | null | undefined
    checkedSignActivity: boolean
}

export interface TemplateRule {
    codeTemplate: number
    nameTemplate: string
    beforeWaresScript: string
    waresCalcScript: string
    afterWaresScript: string
    param: string
    codeEventList: string
    signActivity: number
    typeTemplate: number
    useTemplate: number
}

export interface GroupCoupon {
    codeGroupCoupon: number,
    name: string,
    reusableText: string,
    nameRule: string,
    reusable: number,
    templateText: string | null,
    codeRule: number | null,
    maxSumDiscount: number | null
}

export interface Coupon {
    codeCoupon: number | null | undefined,
    codeGroupCoupon: number,
    barcode: string,
    codeShop: number,
    idWorkplace: number,
    dateBegin: string | null
    dateEnd: string | null
    codeClient: number,
    maxSumDiscount: number | null,
    sourcePlace: string | null,
    applyPlace: string | null,
    codeRuleSource: number | null
    status: number,
    description: string | null,
    nameRuleSource: string | null,
    nameClient: string | null,
    statusText: string | null,
    nameShop: string | null
    addInfo: string | null
}

export interface Designation {
    codeDes: number,
    tableName: string,
    fieldName: string,
    shortValue: number,
    description: string,
    schemaName: string
}

export interface Shop {
    codeShop: number | null,
    nameShop: string,
    signActivity: number,
    codeDealer: number,
    payVat?: number | null,
    codeFirm: number,
    codeSubgroup: number,
    codeTemplate: number,
    address: string,
    checkedSignActivity: boolean,
    codeFormat: number | null
    nameFormat: string | null
    codeLocation: number | null
    nameLocation: string | null
}

export interface Module {
    codeModule: number | null,
    typeModule: number,
    nameModule: string,
    abrModule: string
}

export interface PlaceOption {
    codeOption: number,
    codeModule: number,
    nameModule: string
    nameOption: string
    valueShop: string
    valueTemplateShop: string
    valueWorkplace: string
    valueTemplateWorkplace: string
    valueOption: string | null
    valueOptionText: string | null
    typeValue: number
    typeValueText: string
    levelOption: string | null
    description: string
    typeProgram: number
    changed: boolean
    backupValueOption: string
    defaultValue: string
    param: string
    imageList: Array<any>
    idWorkplace: number
    codeTemplate: number
    deleted: boolean
    typeProgramText: string | null | undefined
    imported: boolean | null | undefined
}

export interface Image {
    codeImage: number
    image: []
    typeValue: number
    codeValue: number
    num: number
    typeRef: number
}

export interface Script {
    codeScript: number
    textScript: string
    description: string
    nameScript: string
    purpose: number
}

export interface Dealer {
    codeDealer: number
    nameDealer: string
    abrDealer: string
}

export interface User {
    codeUser: number
    username: string | null
    password: string | null
    originalPassword: string | null
    dateBegin: string | null
    dateEnd: string | null
    codeProfile: number | null
    nameProfile: string
    nameShop: string
    fio: string
    codeShop: number | null
    signActivity: number
    signActivityText: string
    cardNumber: string | null
    regNumber: string | null
    originalCardNumber: string | null,
    checkedSignActivity: boolean | undefined
}

export interface Profile {
    codeProfile: number
    nameProfile: string
    accessLevel: number
}

export interface MaskBarcode {
    codeMask: number
    name: string
    pattern: string
    searchSourceList: string
    priority: number
    numberCardField: string
    codeOperation: number
    codeRule: number | null
    maxInputTime: number
    searchBonusServer: boolean
    codeShopList: string | null
    propertyShopList: string | null
    propertyShopListText: string | null
    param: string | null
    searchSourceText: string | null
    nameOperation: string | null
    nameRule: string | null
    searchBonusServerText: string | null
    nameShopList: string | null,
    signActivity: number,
    signActivityText: string,
    checkedSignActivity: boolean
}

export interface AccessEvent {
    codeEvent: number
    nameEvent: string
    codeProfile: number
    detailAccessText: string
    detailAccess: string
    checkAccess: boolean
}

export interface Workplace {
    codeShop: number
    idWorkplace: number | null
    codeTemplate: number
    nameTemplate?: string | null
    typeCash: number
    nameTypeCash?: number | null
}

export interface TemplateOption {
    codeTemplate: number
    nameTemplate: string
    typeTemplate: number
    typeTemplateText: string
}

export interface TypeCash {
    codeProperty: number
    codeValue: number | null
    valueProperty: string
    signActivity: number
    checkedSignActivity: boolean
    signActivityText: string
}

export interface OptionValue {
    codeOption: number
    codeValue: number | null
    valueOption: string
    signActivity: number
    description: string
    signActivityText: string
    checkedSignActivity: boolean
}

export interface ShopDealer {
    codeShop: number
    codeDealer: number
    nameDealer: string
}

export interface Option {
    codeOption: number | null
    nameOption: string
    typeValue: number
    defaultValue: string | null
    defaultValueText: string | null
    description: string
    codeModule: number
    posEdit: number
    param: string | null
    nameTypeValue: string | null
    checkedPosEdit: boolean
}

export interface PropertyValue {
    codeValue: number
    codeProperty: number
    valueProperty: string
    signActivity: number
    signActivityText: string
    checkedSignActivity: boolean
}

export interface SetRule {
    codeSetRule: number
    codeRule: number
    numberSet: number
    codeValue: number
    typeValue: number
    quantity: number
    price: number
    percDiscount: number
    sumDiscount: number
    codeDealer: number
    sumPosition: number
    s1: string
    s2: string
    s3: string
    n1: number
    n2: number
    n3: number
    dateBegin: string
    dateEnd: string
    dayWeek: number
    timeActivity: string
    typeDiscount: number
    barcode: string
    phone: string
}

export interface BanWares {
    idWorkplace: number
    codeParam: number
    typeParam: number
    codeShop: number
    nameShop: string
    nameParam: string
    nameTypeParam: string
    id: string
    banPresent: string
}

export interface Department {
    codeDepartment: number
    nameDepartment: string
}

export interface Certificate {
    codeCert: number
    nameCert: string | null
    description: string | null
    discount: number
    dateBegin: string | null
    dateEnd: string | null
    signActivity: number
    timeActivity: string | null
    dayWeek: number
    barcode: string
    idExternal: string | null
    nominal: number | null
    codeAccount: number | null
    typeCert: number | null
    propertyShopListText: string | null
    nameShopList: string | null
    param: string | null
    signActivityText: string | null
    typeCertText: string | null
    sumAccount: number | null,
    checkedSignActivity: boolean
    checkedTypeCertParam: boolean
}

export interface EventPos {
    codeEvent: number | null
    name: string
    checkAccess: boolean
    keepAudit: boolean
    processLoyal: boolean
    checkAccessText: string
    keepAuditText: string
    processLoyalText: string
}

export interface CashStatus {
    codeShop: number
    idWorkplace: number
    nameTypeCash: string
    nameTemplate: string
    ip: string
    stateCash: string
    versionProgram: string
    lastReport: number
    stateLastReport: string
    dateBeginLastReport: string
    dateBeginClosedReport: string
    sumCashBox: number
    numberCashRegister: string
    rroFiscal: string
    datePersonalization: string
    dateLastSendTax: string
    minutesToBlock72: number
    minutesToBlock24: number
    nameKassir: string
    blockedText: string
    codeOptionUpdate: number
    valueOption: string | null
    levelOption: string
    maxVersion: string
    lastDownloadVersion: string
    lastDownloadVersionTime: string
}

export interface ServerStatus {
    codeShop: number
    nameShop: string
    ip: string
    stateServer: string
    versionProgram: string
    codeOptionUpdate: number
    valueOptionCash: string
    nextDownloadDateCash: string
    nextDownloadDateTextCash: string
    nextUpdateDateCash: string
    nextUpdateDateTextCash: string
    maxVersionCash: string
    checkOpenCheck: string
    checkOpenCheckText: string
    checkOpenZReport: string
    checkOpenZReportText: string
    valueOptionServer: string
    nextDownloadDateServer: string
    nextDownloadDateTextServer: string
    nextUpdateDateServer: string
    nextUpdateDateTextServer: string
    maxVersionServer: string
    lastDownloadVersion: string
    lastDownloadVersionTime: string
}

export interface Service {
    name: string
    description: string
    startCommand: string
    stopCommand: string
    started: boolean
    checkStatus: string
}

export interface Task {
    codeTask: number
    nameTask?: string | null | undefined
    description?: string | null | undefined
    textScript?: string | null | undefined
    dateTask?: string | null | undefined
    param: string
    typeProgram: number
}

export interface License {
    codeLicense: number
    licenseKey: string
    description: string
    param: string
    checksum: string
}

export interface ShopProperty {
    codeShop: number
    codeProperty: number
    valueProperty: string
    valuePropertyText?: string
    nameProperty?: string
    typeValue?: number
}

export interface GroupClient {
    codeGroup: number
    codeParentGroup: number
    nameGroup: string
}


export interface Client {
    codeClient: number
    surname: string
    name: string
    patronymic: string
    document: string
    impocition: string
    description: string
    discount: number
    codeDealer: number
    codeDiscountProgram: number
    dateBegin: string
    dateEnd: string
    message: string
    dateBirth: string
    sumReceipt: number
    signActivity: number
    checkedSignStr: string
    checkedSignActivity: boolean
    timeActivity: string
    dayWeek: number
    codeGroupClient: number
    nameGroupClient: string
    typeCard: number
    typeCardText: string
    phone: string
    email: string
    idExternal: string
    qty: number
    dateBirthStr: string
}

export interface BarcodeClient {
    barcode: string
    codeClient: number
    signActivity: number
    signActivityStr: string
    checkedSignActivity: boolean
    addField: string
}

export interface ClientProperty {
    codeClient: number
    codeProperty: string
    valueProperty: string
    valuePropertyText: string
    nameProperty: string
    typeValue: number
}

export interface Account {
    codeAccount: number
    typeAccount: number
    sumAccount: number
    transitSum: number
    nameType: string
    codeClient: number
    dateChange: string
    codeUser: number
}

export interface UnitDimension {
    codeUnit: number
    nameUnit: string
    abrUnit: string
    description: string
    signActivity: number
    signActivityText: string
    checkedSignActivity: boolean
}

export interface BarcodeWares {
    barcode: string
    codeUnit: number | null
    nameUnit: string
    codeWares: number
    signActivity: number
    signActivityText: string
    checkedSignActivity: boolean
    addField: string
}

export interface AdditionUnit {
    codeUnit: number
    codeWares: number
    coefficient: number
    enabledDivisional: string

    buttonDivisional: string
    signActivity: number
    signActivityText: string
    checkedSignActivity: boolean

    signDivisional: number
    signDivisionalText: string
    checkedSignDivisional: boolean

    weight: number | null
    weightVarPerc: number | null
    weightVarAbsolute: number | null
    nameUnit: string
}

export interface WaresProperty {
    codeWares: number
    codeProperty: string
    valueProperty: string
    valuePropertyText: string
    nameProperty: string
    typeValue: number
    nameWares: string
}

export interface PriceDealer {
    codeDealer: number
    codeWares: number
    priceDealer: number
    indicativeMinPrice: number
    indicativeMaxPrice: number
    indicativeBeginDate: string
    indicativeEndDate: string
    indicativeActive: number
    indicativeActiveText: string
    checkedIndicativeActive: boolean
    nameDealer: string
}

export interface AClient {
    idRecord: number
    codeClient: number
    anew: string
    aold: string
    aDateOperation: string
    aTimeOperation: string
    aCodeUser: number
    aOperation: string
    aipSource: string
    aDescr: string
    fio: string
}

export interface PriceType {
    abrType: string
    nameType: string
    priority: number
}

export interface WorkplaceStatus {
    codeShop: number
    idWorkplace: number
    status: string
    problem: string
    replicationBegin: string
    replicationEnd: string
    successfulUpdate: string
    successfulSend: string;
    lastTimeError: string;
    errorMessage: string;
}

export interface RuleLoyal {
    codeRule: number
    codeLoyal: number
    nameRule: string
    description: string
    beforeWaresScript: string
    waresCalcScript: string
    afterWaresScript: string
    beforeWaresText: string
    waresCalcText: string
    afterWaresText: string
    signActivity: number
    dayWeek: number
    timeActivity: string
    priority: number
    dateBegin: string
    dateEnd: string
    sortNum: number
    typeUse: number
    manualRule: number
    codeDiscountGroup: number
    typeOrder: number
    separate: number
    codeEventList: string
    nameGroup: string
    typeOrderStr: string
    typeUseStr: string
    manualRuleStr: string
    param: string
    templateParam: string
    nameTemplateBody: string
    nameLoyal: string
    addInfo: string
}

export interface AClient {
    codeRule: number
    anew: string
    aold: string
    aDateOperation: string
    aTimeOperation: string
    aCodeUser: number
    aOperation: string
    aipSource: string
    aDescr: string
    fio: string
}
