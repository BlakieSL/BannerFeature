INSERT INTO pos.template_rule (code_template, name_template, before_wares_script, wares_calc_script, after_wares_script, param, code_event_list, sign_activity, version_row, type_template, use_template) VALUES (-1, '~Неопределено', null, null, null, null, null, 1, 0, 0, 0);
INSERT INTO pos.template_rule (code_template, name_template, before_wares_script, wares_calc_script, after_wares_script, param, code_event_list, sign_activity, version_row, type_template, use_template) VALUES (1, 'Ручная скидка', 'import common.UserPos
import common.Wares
import common.WaresOrder
import common.SetRule
import common.Value

private boolean isEnableChangePrice(WaresOrder wo) {
    SetRule setRuleExclude = ruleLoyal.setRuleList
            .findAll{it.numberSet == 2}
            .find{(it.typeValue == 0 && it.codeValue == wo.codeWares) || 
                  (it.typeValue == 1 && it.codeValue in wo.waresExt.wares.codeGroupAll) ||
                  (it.typeValue == 5 && wo.waresExt.waresProperty.find {wp -> wp.codeProperty == it.codeValue})}
    return (setRuleExclude == null)
}

private boolean isCorrectNumber(String text) {
    try {
        BigDecimal number = new BigDecimal(text)
        return true
    } catch (Exception ex) {
        master.log(ex)
        return false
    }
}

private void setPrice(WaresOrder wo) {
    if (!isEnableChangePrice(wo)) {
        master.gui.showMessage(master.gui.waresCheckStage, "Для этой группы товаров ручная скидка запрещена")
        return
    }

    if (!wo.signNew) {
        master.gui.showMessage(master.gui.waresCheckStage, "Можно задавать ручную скидку только для последнего товара")
        return
    }

    UserPos user = master.auth.checkAccess(master.gui.waresCheckStage, codeEvent);
    if (user == null) {
        master.gui.showMessage(master.gui.waresCheckStage, master.getResourceValue(master.langResource, ''notaccess'', "Нет доступа"))
        return;
    }

    def manualDiscount = -1.00
    List optList = "#manualDiscountList".split('','')
    ArrayList<Value> listFromOption = []
    optList.each{
        listFromOption.add(new Value(it as String, it +"%"))
    }


/*  список скидок из св-ва товара
    int codeProperty = master.options.getInt("CODE_PROPERTY_MANUAL_DISCOUNT", -1)
    String prop = wo.waresExt.waresProperty.find {it.codeProperty == codeProperty}?.valueProperty
    List propListDiscount = (prop == null || prop.size() == 0) ? [] : prop.split(",").toList()
    ArrayList<Value> listValueFromProp =  []
    propListDiscount.each{
        listValueFromProp.add(new Value(it as String, it +"%"))
    }
*/

    SetRule setRule = ruleLoyal.setRuleList
            .findAll{it.numberSet == 1}
            .find{(it.typeValue == 0 && it.codeValue == wo.codeWares) || 
                  (it.typeValue == 1 && it.codeValue in wo.waresExt.wares.codeGroupAll) ||
                  (it.typeValue == 5 && wo.waresExt.waresProperty.find {wp -> wp.codeProperty == it.codeValue})}
    List setListDiscount = (setRule == null ||  setRule.s1 == null || setRule.s1.trim().isEmpty()) ? [] : setRule.s1.split('','')
    ArrayList<Value> listValueFromSet =  []
    setListDiscount.each{
        listValueFromSet.add(new Value(it as String, it +"%"))
    }

    List listShow = (listValueFromSet.size() == 0) ? listFromOption : listValueFromSet
    if (listShow.size() == 1) {
        manualDiscount = master.roundBigDecimal(listShow[0].value as BigDecimal, 2)
    } else {
        String inputValue = master.gui.showListValues(master.gui.waresCheckStage, "Выберите скидку", listShow)?.value;
        if (inputValue == null) return
        if (isCorrectNumber(inputValue)) {
            manualDiscount = master.roundBigDecimal(inputValue as BigDecimal, 2)
        } else {
            master.gui.showMessage(master.gui.waresCheckStage, "Некорректное значение скидки")
            return
        }
    }

    BigDecimal newPrice = master.roundBigDecimal(wo.price * (1 - manualDiscount/100), 2)

    BigDecimal minPrice = wo.priceDealerObj.indicativeMinPrice == null ? 0.00 : master.roundBigDecimal(wo.priceDealerObj.indicativeMinPrice, 2);
    BigDecimal maxPrice = wo.priceDealerObj.indicativeMaxPrice == null ? 99999999 : master.roundBigDecimal(wo.priceDealerObj.indicativeMaxPrice, 2);

    if (wo.priceDealerObj.indicativeActive == 1 && (newPrice < minPrice || newPrice > maxPrice)) {
        String minPriceText = wo.priceDealerObj.indicativeMinPrice == null ? "не задано" : master.roundBigDecimal(wo.priceDealerObj.indicativeMinPrice, 2);
        String maxPriceText = wo.priceDealerObj.indicativeMaxPrice == null ? "не задано" : master.roundBigDecimal(wo.priceDealerObj.indicativeMaxPrice, 2);
        master.gui.showMessage("Заданная цена ${newPrice} выходит за границы индикатива: min = ${minPriceText}; max = ${maxPriceText}")
        if (newPrice < minPrice) newPrice = minPrice
        else if (newPrice > maxPrice) newPrice = maxPrice
        manualDiscount = master.roundBigDecimal(100*(wo.price - newPrice)/wo.price, 2)
        if (manualDiscount == 0.00) return
    }
    wo.interimData[ruleLoyal.codeRule] = [:]
    wo.interimData[ruleLoyal.codeRule]["manualDiscount"] = manualDiscount
    def audit = master.createAudit();
    audit.codeEvent = codeEvent
    audit.codeWares = wo.codeWares
    audit.quantity = wo.quantity
    audit.codeUnit = wo.codeUnit
    audit.price = wo.price
    audit.codeUser = user.codeUser
    master.auth.insAudit(audit)
}

WaresOrder wo = values["waresOrder"]
Integer codeRule = values["codeRule"] as Integer
if (wo == null || codeRule == null || codeRule != ruleLoyal.codeRule) return
setPrice(wo)

', 'BigDecimal manualDiscount = waresOrder.interimData.get(ruleLoyal.codeRule)?.get("manualDiscount") as BigDecimal
if (manualDiscount == null) return
BigDecimal priceWares = (ruleLoyal.typeUse == 0) ? waresOrder.price : waresOrder.sumPosition/waresOrder.quantity
sumDiscount = master.roundBigDecimal((manualDiscount/100) * waresOrder.quantity * priceWares,2)
', null, '{
  "input" : [{"name": "manualDiscountList", "description": "Список % скидок, через запятую", "type": "string"}],
  "setRule" : {"1": {"name": "Настройки скидок"}, "2": {"name": "Товары-исключения"}},
  "setRuleColumns" : [
          { "id": "nameTypeValue","label": "Тип данных" },
          { "id": "codeValue","label": "Код" },
          { "id": "nameValue","label": "Наименование" },
          { "id": "s1","label": "Список % скидок" }
          ],
  "setRuleTypeValues":[0,1,5]                                                          
}
', null, 1, 0, 0, 0);
INSERT INTO pos.template_rule (code_template, name_template, before_wares_script, wares_calc_script, after_wares_script, param, code_event_list, sign_activity, version_row, type_template, use_template) VALUES (2, 'При покупке N кол-ва товара из них на М скидка', '/************* PARAMETERS - DO NOT REPLACE!!! *************************/
@Field  int calculationParam
@Field  BigDecimal nQuantityParam
@Field  BigDecimal mQuantityParam
@Field  int considerDiscountParam
@Field  int typeDiscountParam
@Field  BigDecimal valueDiscountParam
@Field  int cheapExpensiveParam
@Field  int spreadParam
calculationParam = #calculation
nQuantityParam = #nQuantity
mQuantityParam = #mQuantity
considerDiscountParam = #considerDiscount
typeDiscountParam = #typeDiscount
valueDiscountParam = #valueDiscount
cheapExpensiveParam = #cheapExpensive
spreadParam = #spread
/**********************************************************************/

import common.Check
import common.RuleLoyal
import common.SetRule
import common.WaresOrder
import common.SetRule
import common.WaresOrder
import groovy.transform.Field


check.interimData[ruleLoyal.codeRule] = [:]
check.interimData[ruleLoyal.codeRule]["members"] = []

void addMemberRule(WaresOrder wo) {
    if (!check.interimData[ruleLoyal.codeRule]["members"].contains(wo)) check.interimData[ruleLoyal.codeRule]["members"] << wo
}

def list = check.waresOrderList
        .groupBy {it.codeWares}
        .collectEntries {[(it.key) :  it.value.sum {it.quantity * it.additionUnitObj.coefficient} ]}
list.each{check.interimData[ruleLoyal.codeRule][it.key] = 0.000}

SetRule getSetRule(WaresOrder wo) {
    return ruleLoyal.setRuleList
            .findAll { it.numberSet == 1 }
            .find {
                (it.typeValue == 0 && it.codeValue == wo.codeWares) ||
                        (it.typeValue == 1 && it.codeValue in wo.waresExt.wares.codeGroupAll) ||
                        (it.typeValue == 5 && wo.waresExt.waresProperty.find { wp -> wp.codeProperty == it.codeValue })
            }
}

List getSortedWares(List list, int sortMode) {
    if (sortMode == 0) {
        return list.findAll{wr -> !wr.isDeleted}.sort{a,b -> a.priceDealerObj.priceDealer <=> b.priceDealerObj.priceDealer}
    } else if (sortMode == 1) {
        return list.findAll{wr -> !wr.isDeleted}.sort{a,b -> b.priceDealerObj.priceDealer <=> a.priceDealerObj.priceDealer}
    }  else return list
}

if (calculationParam == 0) {
    check.waresOrderList.each { wo ->
        wo.interimData[ruleLoyal.codeRule] = [:]
        SetRule setRule = getSetRule(wo)
        if (setRule == null) return;
        addMemberRule(wo)
        BigDecimal qtyN = (setRule.quantity == null) ? nQuantityParam: setRule.quantity
        BigDecimal qtyM = (setRule.n1 == null) ? mQuantityParam: setRule.n1
        BigDecimal qtyDiscount = 0.00
        if (considerDiscountParam == 0) {
            qtyDiscount = [(((list[wo.codeWares] as BigDecimal) / qtyN) as int) * qtyM - check.interimData[ruleLoyal.codeRule][wo.codeWares], wo.quantity].min()
        } else if (considerDiscountParam == 1) {
            qtyDiscount = (list[wo.codeWares] >= qtyN) ? [qtyM - check.interimData[ruleLoyal.codeRule][wo.codeWares], wo.quantity].min() : 0.00
        }
        wo.interimData[ruleLoyal.codeRule]["qtyDiscount"] = qtyDiscount
        check.interimData[ruleLoyal.codeRule][wo.codeWares] += qtyDiscount
        wo.interimData[ruleLoyal.codeRule]["setRule"] = setRule
    }
} else if (calculationParam == 1) {
    BigDecimal quantityAll = check.waresOrderList
            .findAll { wo ->
                ruleLoyal.setRuleList.findAll {
                    (it.numberSet == 1) &&
                            ((it.typeValue == 0 && it.codeValue == wo.codeWares) ||
                                    ( it.typeValue == 1 && it.codeValue in wo.waresExt.wares.codeGroupAll) ||
                                    ( it.typeValue == 5 && wo.waresExt.waresProperty.find { wp -> wp.codeProperty == it.codeValue }))
                }.size() > 0}.sum(0.00, {it.quantity * it.additionUnitObj.coefficient})

    BigDecimal qtyN = nQuantityParam
    BigDecimal qtyM = mQuantityParam
    BigDecimal qtyDiscountAll = 0.00
    if (considerDiscountParam == 0) {
        qtyDiscountAll = [((quantityAll / qtyN) as int) * qtyM , quantityAll].min()
    } else if (considerDiscountParam == 1) {
        qtyDiscountAll = (quantityAll >= qtyN) ? [qtyM , quantityAll].min() : 0.00
    }
    getSortedWares(check.waresOrderList, cheapExpensiveParam).each { wo ->
        wo.interimData[ruleLoyal.codeRule] = [:]
        SetRule setRule = getSetRule(wo)
        if (setRule == null) return;
        addMemberRule(wo)
        BigDecimal qtyDiscountWares = [qtyDiscountAll, wo.quantity].min()
        wo.interimData[ruleLoyal.codeRule]["qtyDiscount"] = qtyDiscountWares
        wo.interimData[ruleLoyal.codeRule]["setRule"] = setRule
        qtyDiscountAll -= qtyDiscountWares
    }
}', '/************* PARAMETERS - DO NOT REPLACE!!! *************************/
@Field  int calculationParam
@Field  BigDecimal nQuantityParam
@Field  BigDecimal mQuantityParam
@Field  int considerDiscountParam
@Field  int typeDiscountParam
@Field  BigDecimal valueDiscountParam
@Field  int cheapExpensiveParam
@Field  int spreadParam
calculationParam = #calculation
nQuantityParam = #nQuantity
mQuantityParam = #mQuantity
considerDiscountParam = #considerDiscount
typeDiscountParam = #typeDiscount
valueDiscountParam = #valueDiscount
cheapExpensiveParam = #cheapExpensive
spreadParam = #spread
/**********************************************************************/

import common.SetRule
import groovy.transform.Field

/*
Check check
RuleLoyal ruleLoyal
*/

BigDecimal qtyDiscount = waresOrder.interimData[ruleLoyal.codeRule]["qtyDiscount"] as BigDecimal
SetRule setRule = waresOrder.interimData[ruleLoyal.codeRule]["setRule"] as SetRule
if (qtyDiscount == null || qtyDiscount <= 0) return;

int typeDiscount = (setRule.typeDiscount == null) ? typeDiscountParam : setRule.typeDiscount
BigDecimal discount = (setRule.n2 == null) ? valueDiscountParam: setRule.n2
BigDecimal priceWares = (ruleLoyal.typeUse == 0) ? waresOrder.price : waresOrder.sumPosition/waresOrder.quantity
if (typeDiscount == 0) {
    sumDiscount = master.roundBigDecimal(priceWares * waresOrder.quantity - ((waresOrder.quantity - qtyDiscount) * priceWares + qtyDiscount * priceWares * (1 - discount/100)) ,2)
} else if (typeDiscount == 1) {
    sumDiscount = waresOrder.quantity * priceWares - ((waresOrder.quantity - qtyDiscount) * priceWares + qtyDiscount * discount)
} else if (typeDiscount == 2) {
    sumDiscount = qtyDiscount * discount
}
discountStructure = [[qtyDiscount, sumDiscount]]
waresOrder.interimData[ruleLoyal.codeRule]["sumDiscount"] = sumDiscount

', '/************* PARAMETERS - DO NOT REPLACE!!! *************************/
@Field int spread
@Field int calculation
spread = #spread
calculation = #calculation
/**********************************************************************/

import common.Check
import common.RuleLoyal
import common.Wares
import common.WaresOrder
import groovy.transform.Field
import manage.Master

/*
Check check
*/
void postCalculate () {
    if (spread == 1) return
    if (calculation == 0) {
        spreadIndividual(check)
    } else {
        spreadSet(check)
    }
}

BigDecimal getFreeSumNM(WaresOrder wo) {
    return wo.sumPosition +
            (wo.discountList.get(ruleLoyal.codeRule)?.get("sumDiscount") ?: 0.00) -
            wo.quantity * (wo.priceDealerObj.indicativeActive == 1 ? (wo.priceDealerObj.indicativeMinPrice ?: 0) : 0)
}

Map getMapDiscountNM(WaresOrder wo, RuleLoyal ruleLoyal, BigDecimal sumDiscount) {
    BigDecimal sumPositionClean =  (ruleLoyal.typeUse == 0) ? (wo.price * wo.quantity) : (wo.sumPosition + wo.discountList.get(ruleLoyal.codeRule)?.get("sumDiscount")?:0.00)
    BigDecimal percentDiscount = (sumPositionClean.compareTo(BigDecimal.ZERO) == 0) ? 0.toBigDecimal() : Master.roundBigDecimal(100 * sumDiscount / sumPositionClean, 6)
    return ["codeRule"   : ruleLoyal.codeRule,
            "percentDiscount" : percentDiscount,
            "sumDiscount": sumDiscount,
            "nameRule"   : ruleLoyal.nameRule,
            "typeAction" : 0,
            "typeUse"    : ruleLoyal.typeUse,
            "codeGroup"  : ruleLoyal.codeDiscountGroup,
            "sortNum"    : ruleLoyal.sortNum,
            "separate"   : (ruleLoyal.separate == (1 as short))]
}

List<WaresOrder> getWaresRule(){
    return check.waresOrderList.findAll { wo ->
        ruleLoyal.setRuleList
                .findAll {
                    it.numberSet == 1 &&
                            ((it.typeValue == 0 && it.codeValue == wo.codeWares) ||
                                    ( it.typeValue == 1 && it.codeValue in wo.waresExt.wares.codeGroupAll) ||
                                    ( it.typeValue == 5 && wo.waresExt.waresProperty.find { wp -> wp.codeProperty == it.codeValue }))
                }.size() > 0
    }
}

void spreadIndividual(Check check) {
    def list =  getWaresRule().groupBy {it.codeWares}
    list.each {
        BigDecimal sumDiscount = it.value.sum(0.00, {WaresOrder wo-> wo.discountList.get(ruleLoyal.codeRule)?.get("sumDiscount")?:0})
        if (sumDiscount == 0) return
        spreadListNM(it.value, sumDiscount)
    }
}

void spreadSet(Check check) {
    BigDecimal sumDiscount = check.waresOrderList.findAll { it.discountList.containsKey(ruleLoyal.codeRule) }
            .collect { it.discountList.findAll {it.key == ruleLoyal.codeRule }.values() }
            .sum(0.00, { it[''sumDiscount''] })
    if (sumDiscount == 0) return

    List listN = getWaresRule().sort { wo -> -getFreeSumNM(wo) }
    spreadListNM(listN, sumDiscount)
}

void spreadListNM(List<WaresOrder> listN, BigDecimal sumDiscount) {
    BigDecimal sumDiscountBackup = sumDiscount
    BigDecimal sumN = listN.sum { WaresOrder wo -> getFreeSumNM(wo) }
    Map relWeight = listN.collectEntries { wo -> [(wo.num): getFreeSumNM(wo) / sumN] }

    Map<WaresOrder, BigDecimal> spreadSum = [:]
    listN.each { wo ->
        BigDecimal sumDiscountWares = (sumDiscountBackup * relWeight[wo.num]).setScale(2, BigDecimal.ROUND_DOWN)
        if (sumDiscountWares == 0) return
        sumDiscount -= sumDiscountWares
        spreadSum[wo] = sumDiscountWares
    }
    spreadSum.each { it ->
        if (sumDiscount == 0) return
        BigDecimal sumDiscountWares = [sumDiscount, getFreeSumNM(it.key) - it.value].min()
        it.value += sumDiscountWares
        sumDiscount -= sumDiscountWares
    }
    assert sumDiscount == 0
    spreadSum.each {
        it.key.discountList[ruleLoyal.codeRule] = getMapDiscountNM(it.key, ruleLoyal, it.value)
    }
}
', '{
    "input": [
        {
            "name": "calculation",
            "description": "Расчет вести для",
            "type": "fixedList",
            "list": {
            "0": "Товаров индивидуально",
            "1": "Набора товаров"
        },
            "defaultValue": "0"
        },
        {"name": "nQuantity", "description": "N - общее количество", "type": "number"},
        {"name": "mQuantity", "description": "M - количество скидкой", "type": "number"},
        {
            "name": "considerDiscount",
            "description": "Считать скидку по N",
            "type": "fixedList",
            "list": {
            "0": "За каждые",
            "1": "Больше или равно"
        },
            "defaultValue": "0"
        },
        {"name": "typeDiscount", "description": "Как применить скидку","type":"listFromDB","codeReport":159},
        {"name": "valueDiscount", "description": "Значение скидки", "type": "number"},
        {
            "name": "cheapExpensive",
            "description": "Скидку начислять на",
            "type": "fixedList",
            "list": {
            "0": "Самые дешевые товары",
            "1": "Самые дорогие товары"
        },
            "defaultValue": "0"
        },
        {
            "name": "spread",
            "description": "Сумму скидки распределять на",
            "type": "fixedList",
            "list": {
            "0": "Сумму скидки распределять на N",
            "1": "Сумму скидки распределять на M"
        },
            "defaultValue": "1"
        }

],
    "setRule": {
    "1": {
        "name": "Товары для скидки"
    }
},
    "setRuleColumns" : [
        { "id": "nameTypeValue","label": "Тип данных" },
        { "id": "codeValue","label": "Код" },
        { "id": "nameValue","label": "Наименование" },
        { "id": "quantity","label": "N - общее количество" },
        { "id": "n1","label": "M - количество со скидкой" },
        { "id": "nameTypeDiscount","label": "Тип скидки" },
        { "id": "n2","label": "Значение" }
    ],
    "setRuleTypeValues":[0,1,5]
}', null, 1, 0, 0, 0);
INSERT INTO pos.template_rule (code_template, name_template, before_wares_script, wares_calc_script, after_wares_script, param, code_event_list, sign_activity, version_row, type_template, use_template) VALUES (3, 'На набор товаров (корзина)', 'import common.WaresOrder

check.interimData[ruleLoyal.codeRule] = [:]
check.interimData[ruleLoyal.codeRule]["members"] = []
check.waresOrderList.each{wo -> wo.interimData[ruleLoyal.codeRule] = [:]}

List<Integer> getListNumberSet() {
    List list = []
    ruleLoyal.setRuleList.findAll{it.numberSet > 0}.each(){ set ->
        list << (set.numberSet)
    }
    return list.unique()
}


getListNumberSet().forEach {num ->
    List<Integer> qtyBasketList = []
    ruleLoyal.setRuleList.findAll { it.numberSet == num}.forEach{ set ->
        int qtyBasket = check.waresOrderList.findAll{wo -> wo.codeWares == set.codeValue}
                .sum(0.000, {wo -> wo.quantity * wo.additionUnitObj.coefficient})/set.quantity
        qtyBasketList << qtyBasket
    }
    int qtyDiscountComplect = qtyBasketList.min()
    if (qtyDiscountComplect > 0) {
        ruleLoyal.setRuleList.findAll { it.numberSet == num}.forEach{ set ->
            BigDecimal qtyDiscount = set.quantity * qtyDiscountComplect
            check.waresOrderList.findAll{wo -> wo.codeWares == set.codeValue}.each{ wo ->
                addMemberRule(wo)
                wo.interimData[ruleLoyal.codeRule] = [:]
                wo.interimData[ruleLoyal.codeRule]["setRule"] = set
                if (qtyDiscount <= 0) return
                BigDecimal qtyBasis = wo.quantity * wo.additionUnitObj.coefficient
                BigDecimal qtyDiscountPositionBasis = [qtyDiscount, qtyBasis].min()
                wo.interimData[ruleLoyal.codeRule]["qtyDiscount"] = qtyDiscountPositionBasis/wo.additionUnitObj.coefficient
                qtyDiscount -= qtyDiscountPositionBasis
            }
        }
    }
};

void addMemberRule(WaresOrder wo) {
    if (!check.interimData[ruleLoyal.codeRule]["members"].contains(wo)) check.interimData[ruleLoyal.codeRule]["members"] << wo
}', '/************* PARAMETERS - DO NOT REPLACE!!! *************************/
@Field boolean checkOtherRuleInBasket
@Field int typeDiscount
checkOtherRuleInBasket = #checkOtherRuleInBasket
typeDiscount =       #typeDiscount
/**********************************************************************/

import common.Check
import common.SetRule
import common.Wares
import common.WaresOrder
import groovy.transform.Field

SetRule setRule = waresOrder.interimData.get(ruleLoyal.codeRule)?.get("setRule")
BigDecimal qtyDiscount = waresOrder.interimData.get(ruleLoyal.codeRule)?.get("qtyDiscount")
if (qtyDiscount == null || qtyDiscount <= 0 || setRule == null) return

if (checkOtherRuleInBasket && check.waresOrderList.find{wo -> wo.interimData.get(ruleLoyal.codeRule)?.get("setRule")?.numberSet == setRule.numberSet && wo.discountList.find{it.key != ruleLoyal.codeRule} != null} != null) return
BigDecimal priceWares = (ruleLoyal.typeUse == 0) ? waresOrder.price : waresOrder.sumPosition/waresOrder.quantity

int typeDiscountValue = (setRule.typeDiscount == null) ? typeDiscount : setRule.typeDiscount
if (setRule.n1 == null) return
if (typeDiscountValue == 0) {
    BigDecimal percentDiscount = setRule.n1
    sumDiscount = master.roundBigDecimal(priceWares * waresOrder.quantity * percentDiscount / 100, 6)
} else if (typeDiscountValue == 1) {
    sumDiscount = master.roundBigDecimal((priceWares - setRule.n1) * waresOrder.quantity, 6)
} else if (typeDiscountValue == 2) {
    sumDiscount = setRule.n1 * quantity
}

discountStructure = [[qtyDiscount, sumDiscount]]
waresOrder.interimData[ruleLoyal.codeRule]["sumDiscount"] = sumDiscount
', null, '{
    "input" : [
        {"name": "typeDiscount", "description": "Как применить скидку", "type": "fixedList", "list":{"0":"% скидки", "1":"Новая цена, грн", "2":"Сумма скидки на позицию, грн"},"defaultValue":"0"},
        {"name": "checkOtherRuleInBasket", "description": "Не применять скидку, если на товары корзины действуют другие скидки", "type": "boolean"}
        ] ,
    "setRuleColumns" : [
        { "id": "nameTypeValue","label": "Тип данных" },
        { "id": "codeValue","label": "Код" },
        { "id": "nameValue","label": "Наименование" },
        { "id": "quantity","label": "Количество" },
        { "id": "nameTypeDiscount","label": "Тип скидки" },
        { "id": "n1","label": "Значение" }
],
    "setRuleTypeValues":[0]                                         
}', null, 1, 0, 0, 0);
INSERT INTO pos.template_rule (code_template, name_template, before_wares_script, wares_calc_script, after_wares_script, param, code_event_list, sign_activity, version_row, type_template, use_template) VALUES (4, 'На группу товаров или товар', '/******* PARAMETERS - DO NOT REPLACE!!! *************************/
@Field int typeDiscountParam
@Field BigDecimal valueDiscountParam
@Field int typeBorderParam
@Field int assignDiscountParam
@Field int applyDiscountParam

typeDiscountParam =        #typeDiscount
valueDiscountParam =       #valueDiscount
typeBorderParam =          #typeBorder
assignDiscountParam =      #assignDiscount
applyDiscountParam =       #applyDiscount
/***************************************************************/

import common.Check
import common.RuleLoyal
import common.SetRule
import common.Wares
import common.WaresOrder
import groovy.transform.Field

/*Check check
RuleLoyal ruleLoyal*/

check.interimData[ruleLoyal.codeRule] = [:]
check.interimData[ruleLoyal.codeRule]["members"] = []
check.waresOrderList.each { waresOrder ->
    waresOrder.interimData[ruleLoyal.codeRule] = [:]
    waresOrder.interimData[ruleLoyal.codeRule]["qtyDiscount"] = 0.00
    waresOrder.interimData[ruleLoyal.codeRule]["sumDiscount"] = null
    waresOrder.interimData[ruleLoyal.codeRule]["sumDiscountPrepare"] = null
    waresOrder.interimData[ruleLoyal.codeRule]["discountStructure"] = []
}

void addMemberRule(WaresOrder wo) {
    if (!check.interimData[ruleLoyal.codeRule]["members"].contains(wo)) check.interimData[ruleLoyal.codeRule]["members"] << wo
}

List<WaresOrder> waresOrderList = check.waresOrderList.findAll {wo ->
    ruleLoyal.setRuleList.findAll{setRule ->
        setRule.numberSet == 2 &&
                ((setRule.typeValue == 0 && setRule.codeValue == wo.codeWares) ||
                        (setRule.typeValue == 1 && setRule.codeValue in wo.waresExt.wares.codeGroupAll) ||
                        (setRule.typeValue == 5 && wo.waresExt.waresProperty.find {wp -> wp.codeProperty == setRule.codeValue}))}.size() == 0
}.sort{it.price}

check.waresOrderList.findAll {wo ->
    ruleLoyal.setRuleList.findAll{setRule ->
        setRule.numberSet == 1 &&
                ((setRule.typeValue == 0 && setRule.codeValue == wo.codeWares) ||
                        (setRule.typeValue == 1 && setRule.codeValue in wo.waresExt.wares.codeGroupAll) ||
                        (setRule.typeValue == 5 && wo.waresExt.waresProperty.find {wp -> wp.codeProperty == setRule.codeValue}))}.size() > 0
}.each {wo -> addMemberRule(wo)}

Map<SetRule, BigDecimal> setRuleQty = ruleLoyal.setRuleList
        .findAll{it.numberSet == 1}
        .collectEntries {[(it):(waresOrderList.findAll {waresOrder ->
            (it.typeValue == 0 && it.codeValue == waresOrder.codeWares) ||
                    (it.typeValue == 1 && it.codeValue in waresOrder.waresExt.wares.codeGroupAll) ||
                    (it.typeValue == 5 && waresOrder.waresExt.waresProperty.find {wp -> wp.codeProperty == it.codeValue})}
                .sum(0.00,{ waresOrder -> waresOrder.quantity * waresOrder.additionUnitObj.coefficient}))]}
        .findAll {(it.key.quantity?:0 as BigDecimal)  <= (it.value as BigDecimal)}

Map<SetRule, BigDecimal> setRuleSum = ruleLoyal.setRuleList
        .findAll{it.numberSet == 1}
        .collectEntries {[(it):(waresOrderList.findAll {waresOrder ->
            ((it.typeValue == 0 && it.codeValue == waresOrder.codeWares) ||
                    (it.typeValue == 1 && it.codeValue in waresOrder.waresExt.wares.codeGroupAll) ||
                    (it.typeValue == 5 && waresOrder.waresExt.waresProperty.find {wp -> wp.codeProperty == it.codeValue}))}
                .sum(0.00,{ waresOrder -> (ruleLoyal.typeUse == 0) ? (waresOrder.quantity * waresOrder.price) : waresOrder.sumPosition}))]}
        .findAll {((it.key.quantity?:0) as BigDecimal)  <= (it.value as BigDecimal)}

SetRule getSetRuleWaresOrder (WaresOrder waresOrder, Set<SetRule> setRuleList) {
    SetRule setRule = setRuleList
            .findAll{it.numberSet == 1 && it.typeValue == 0 && it.codeValue == waresOrder.codeWares }
            .sort { -it.quantity ?: 0.00 }[0]
    if (setRule == null) {
        setRule = setRuleList
                .findAll{it.numberSet == 1 && it.typeValue == 1 && it.codeValue in waresOrder.waresExt.wares.codeGroupAll }
                .sort { -it.quantity ?: 0.00 }[0]
    } else if (setRule == null) {
        setRule = setRuleList
                .findAll{it.numberSet == 1 && it.typeValue == 5 && waresOrder.waresExt.waresProperty.find {wp -> wp.codeProperty == it.codeValue} }
                .sort { -it.quantity ?: 0.00 }[0]
    }
    return setRule
}

BigDecimal calculateSumDiscount(WaresOrder wo, SetRule setRule, BigDecimal quantity) {
    BigDecimal priceWares = (ruleLoyal.typeUse == 0) ? wo.price : (wo.sumPosition - wo.payInfo.entrySet().sum(0.00, {it.value}))/wo.quantity
    BigDecimal sumDiscount = 0.00
    int typeDiscountValue = (setRule.typeDiscount == null) ? typeDiscountParam : setRule.typeDiscount
    BigDecimal valueDiscount = setRule.n1 == null ? valueDiscountParam: setRule.n1
    if (typeDiscountValue == 0) {
        BigDecimal percentDiscount = valueDiscount
        sumDiscount = master.roundBigDecimal(priceWares * quantity * percentDiscount / 100, 6)
    } else if (typeDiscountValue == 1) {
        sumDiscount = master.roundBigDecimal((priceWares - valueDiscount) * quantity, 6)
    } else if (typeDiscountValue == 2) {
        sumDiscount = valueDiscount * quantity
    }
    return sumDiscount
}


def spreadDiscount = {SetRule setRule ->
    List<WaresOrder> list = waresOrderList.findAll{waresOrder ->
        waresOrder.interimData.get(ruleLoyal.codeRule)?.get("sumDiscount") == null &&
                ((setRule.typeValue == 0 && setRule.codeValue == waresOrder.codeWares) ||
                        (setRule.typeValue == 1 && setRule.codeValue in waresOrder.waresExt.wares.codeGroupAll) ||
                        (setRule.typeValue == 5 && waresOrder.waresExt.waresProperty.find {wp -> wp.codeProperty == setRule.codeValue}))
    }.sort{wo -> -getFreeSum(wo) }

    BigDecimal sumDiscount = list.sum(0.00, {wo -> wo.interimData[ruleLoyal.codeRule]["sumDiscountPrepare"]?:0.00})
    spreadList(list, sumDiscount)
}

BigDecimal getFreeSum(WaresOrder wo) {
    return wo.sumPosition +
            (wo.discountList.get(ruleLoyal.codeRule)?.get("sumDiscount") ?: 0.00) -
            wo.quantity * (wo.priceDealerObj.indicativeActive == 1 ? (wo.priceDealerObj.indicativeMinPrice ?: 0) : 0)
}

def applyDiscount = {
    if (applyDiscountParam == 0) {
        waresOrderList.each { wo -> wo.interimData[ruleLoyal.codeRule]["sumDiscount"] = wo.interimData[ruleLoyal.codeRule]["sumDiscountPrepare"] }
    } else {
        Map<SetRule, BigDecimal> setRuleList = typeBorderParam == 0 ? setRuleQty : setRuleSum
        setRuleList.findAll {it.key.typeValue == 0}.sort{-it.value}.each {spreadDiscount(it.key) }
        setRuleList.findAll {it.key.typeValue == 1}.sort{-it.value}.each {spreadDiscount(it.key) }
        setRuleList.findAll {it.key.typeValue == 5}.sort{-it.value}.each {spreadDiscount(it.key) }
    }
}

boolean waresOrderMatchSetRule(WaresOrder wo, SetRule sr){
    return (sr.typeValue == 0 && sr.codeValue == wo.codeWares) ||
            (sr.typeValue == 1 && sr.codeValue in wo.waresExt.wares.codeGroupAll) ||
            (sr.typeValue == 5 && wo.waresExt.waresProperty.find {wp -> wp.codeProperty == sr.codeValue})
}

boolean isMemberRule(WaresOrder wo){

}

if (assignDiscountParam == 0) {
    waresOrderList.each { waresOrder ->
        SetRule setRule = getSetRuleWaresOrder(waresOrder, ((typeBorderParam == 0) ? setRuleQty.keySet() : setRuleSum.keySet()))
        if (setRule == null) return
        waresOrder.interimData[ruleLoyal.codeRule]["sumDiscountPrepare"] = calculateSumDiscount(waresOrder, setRule, waresOrder.quantity)
    }
    applyDiscount()
} else {
    Map<SetRule, BigDecimal> setRuleMap = (typeBorderParam == 0) ? setRuleQty : setRuleSum
    Map<String, BigDecimal> setRuleDiscount = [:]
    setRuleMap.findAll { it.key.typeValue == 0 }
            .groupBy { it.key.codeValue }
            .each { it ->  it.value.sort { -it.key.quantity }
                    .each {e -> prepareDiscount(waresOrderList, e.key, e.value, setRuleDiscount) }
            }
    setRuleMap.findAll { it.key.typeValue == 1 }
            .groupBy { it.key.codeValue }
            .each { it -> it.value.sort { -it.key.quantity }
                    .each {e -> prepareDiscount(waresOrderList, e.key, e.value, setRuleDiscount) }
            }
    setRuleMap.findAll { it.key.typeValue == 5 }
            .groupBy { it.key.codeValue }
            .each { it -> it.value.sort { -it.key.quantity }
                    .each {e -> prepareDiscount(waresOrderList, e.key, e.value, setRuleDiscount) }
            }
    applyDiscount()
}

void prepareDiscount(List<WaresOrder> waresOrderList, SetRule setRule, BigDecimal value, Map<String, BigDecimal> setRuleDiscount) {
    String key = setRule.typeValue + "-" + setRule.codeValue
    BigDecimal discountSetRulePrev = setRuleDiscount[key] ?: 0.00
    BigDecimal discountRange = (value - (setRule.quantity?:0.00) - discountSetRulePrev)
    waresOrderList.findAll{waresOrder -> waresOrderMatchSetRule(waresOrder, setRule) }
            .each {wo ->
                if (discountRange <= 0) return
                BigDecimal priceWares = (ruleLoyal.typeUse == 0) ? wo.price : (wo.sumPosition - wo.payInfo.entrySet().sum(0.00, {it.value}))/wo.quantity
                BigDecimal coef = (typeBorderParam == 0) ? 1 : (priceWares * wo.additionUnitObj.coefficient)
                BigDecimal qtyEarlier = wo.interimData[ruleLoyal.codeRule]["discountStructure"].sum(0.00, {it[0]})
                BigDecimal qtyDiscountWares = [(discountRange/coef as int) as BigDecimal, wo.quantity - qtyEarlier].min()
                if (qtyDiscountWares <= 0) return
                BigDecimal sumDiscountWares = calculateSumDiscount(wo, setRule, qtyDiscountWares)
                wo.interimData[ruleLoyal.codeRule]["sumDiscountPrepare"] = (wo.interimData[ruleLoyal.codeRule]["sumDiscountPrepare"]?:0.00) + sumDiscountWares
                if (sumDiscountWares > 0) wo.interimData[ruleLoyal.codeRule]["discountStructure"] << [qtyDiscountWares, sumDiscountWares]
                discountRange -= qtyDiscountWares * coef
                setRuleDiscount[key] = (setRuleDiscount[key] ?: 0.00) + qtyDiscountWares * coef
            }
}

void spreadList(List<WaresOrder> list, BigDecimal sumDiscount) {
    BigDecimal sumDiscountBackup = sumDiscount
    BigDecimal sumN = list.sum { WaresOrder wo -> getFreeSum(wo) }
    Map relWeight = list.collectEntries { wo -> [(wo.num): getFreeSum(wo) / sumN] }

    list.each { wo ->
        wo.interimData[ruleLoyal.codeRule]["discountStructure"] = []
        BigDecimal sumDiscountWares = (sumDiscountBackup * relWeight[wo.num]).setScale(2, BigDecimal.ROUND_DOWN)
        if (sumDiscountWares == 0) return
        sumDiscount -= sumDiscountWares
        wo.interimData[ruleLoyal.codeRule]["sumDiscount"] = sumDiscountWares
    }
    list.each { it ->
        if (sumDiscount == 0) return
        BigDecimal sumCurDiscount = (it.interimData[ruleLoyal.codeRule]["sumDiscount"]?:0.00)
        BigDecimal sumDiscountWares = [sumDiscount, getFreeSum(it) - sumCurDiscount].min()
        it.interimData[ruleLoyal.codeRule]["sumDiscount"] = sumCurDiscount + sumDiscountWares
        sumDiscount -= sumDiscountWares
    }
    assert sumDiscount == sumDiscountBackup - list.sum(0.00, {it.interimData[ruleLoyal.codeRule]["sumDiscount"]})
}
', 'sumDiscount = waresOrder.interimData.get(ruleLoyal.codeRule)?.get("sumDiscount")
discountStructure = waresOrder.interimData[ruleLoyal.codeRule]["discountStructure"]', null, '{
  "input" : [
    {"name": "assignDiscount", "description": "Способ назначения скидки", "type": "fixedList", "list":{"0":"Пороговый", "1":"Ступенчатый"},"defaultValue":"0"},
    {"name": "typeBorder", "description": "Тип пороговых значений", "type": "fixedList", "list":{"0":"Количественный", "1":"Суммовой"},"defaultValue":"0"},
    {"name": "typeDiscount", "description": "Тип скидки","type":"listFromDB","codeReport":159},
    {"name": "applyDiscount", "description": "Как применить скидку", "type": "fixedList", "list":{"0":"Скидка на отдельную позицию(артикул)", "1":"Распределить на группу товаров"},"defaultValue":"0"},
    {"name": "valueDiscount", "description": "Значение скидки", "type": "number"}
  ] ,
  "setRule" : {"1": {"name": "Товары для скидки" },
    "2": {"name": "Товары-исключения"}},
  "setRuleColumns" : [
    { "id": "nameTypeValue","label": "Тип данных" },
    { "id": "codeValue","label": "Код" },
    { "id": "nameValue","label": "Наименование" },
    { "id": "quantity","label": "Количество или сумма" },
    { "id": "nameTypeDiscount","label": "Тип скидки" },
    { "id": "n1","label": "Значение" }
  ],
  "setRuleTypeValues":[0,1,5],
  "setRuleSortColumns": ["codeValue", "quantity"],
  "setRuleUniqueFields": ["typeValue","codeValue", "quantity"]
}', null, 1, 0, 0, 0);
INSERT INTO pos.template_rule (code_template, name_template, before_wares_script, wares_calc_script, after_wares_script, param, code_event_list, sign_activity, version_row, type_template, use_template) VALUES (5, 'На корзину из списков товаров', 'import common.Check
import common.RuleLoyal
import common.SetRule
import common.WaresOrder

/************* PARAMETERS - DO NOT REPLACE!!! *************************/
@Field int sort
sort =        #sort
/**********************************************************************/

import common.Check
import common.RuleLoyal
import common.SetRule
import common.WaresOrder
import groovy.transform.Field

/*
Check check
RuleLoyal ruleLoyal
WaresOrder waresOrder
*/

check.interimData[ruleLoyal.codeRule] = [:]
check.interimData[ruleLoyal.codeRule]["members"] = []

List<Integer> getListNumberSet() {
    return ruleLoyal.setRuleList
            .findAll{it.numberSet > 0 && it.quantity != null && it.quantity > 0}
            .collect {set -> set.numberSet}
            .unique()
}

List listNumSet = getListNumberSet()
List<Integer> qtyBasketList = []
check.waresOrderList.each{wo -> wo.interimData[ruleLoyal.codeRule] = [:]}
listNumSet.each { num ->
    BigDecimal qtyBasket = 0.000
    ruleLoyal.setRuleList.findAll { it.numberSet == num && it.quantity != null && it.quantity > 0}.forEach { set ->
        check.waresOrderList.each { wo ->
            if (wo.interimData.get(ruleLoyal.codeRule)?.get("setRule") == null &&
                    ((set.typeValue == 0 && set.codeValue == wo.codeWares) ||
                            (set.typeValue == 1 && set.codeValue in wo.waresExt.wares.codeGroupAll) ||
                            (set.typeValue == 5) && wo.waresExt.waresProperty.find { wp -> wp.codeProperty == set.codeValue })){
                qtyBasket += wo.quantity * wo.additionUnitObj.coefficient / set.quantity
                wo.interimData[ruleLoyal.codeRule]["setRule"] = set
            }
        }
    }
    qtyBasketList << (master.roundBigDecimal(qtyBasket, 2) as int)
}
int qtyDiscountComplect = qtyBasketList.min()?:0

if (qtyDiscountComplect == 0) return

List sortDiscountWares(List list) {
/*
    0 - без сортировки (сортировка по порядку ввода)
    1 - сортировка по цене по убыванию
    2 - сортировка по цене по возрастанию
*/
//    int 2 = 2
    int sortMode = sort
    if (sortMode == 0) {
        return list.findAll{wr -> !wr.isDeleted }
    } else if (sortMode == 1) {
        return list.findAll{wr -> !wr.isDeleted}.sort{a,b -> b.priceDealerObj.priceDealer <=> a.priceDealerObj.priceDealer}
    }  else if (sortMode ==2) {
        return list.findAll{wr -> !wr.isDeleted}.sort{a,b -> a.priceDealerObj.priceDealer <=> b.priceDealerObj.priceDealer}
    }
}

void addMemberRule(WaresOrder wo) {
    if (!check.interimData[ruleLoyal.codeRule]["members"].contains(wo)) check.interimData[ruleLoyal.codeRule]["members"] << wo
}

listNumSet.each { num ->
    BigDecimal qtyDiscountComplectBasket = qtyDiscountComplect
    sortDiscountWares(check.waresOrderList)
            .findAll{ wo -> wo.interimData.get(ruleLoyal.codeRule)?.get("setRule")?.numberSet == num}
            .each{ wo ->
                SetRule setRule = wo.interimData[ruleLoyal.codeRule]["setRule"]
                if (setRule == null) return
                addMemberRule(wo)
                BigDecimal qtyDiscountSet = qtyDiscountComplectBasket * setRule.quantity
                if (qtyDiscountSet <= 0) return
                BigDecimal qtyBasis = wo.quantity * wo.additionUnitObj.coefficient
                BigDecimal qtyDiscountPositionBasis = [qtyDiscountSet, qtyBasis].min()
                wo.interimData[ruleLoyal.codeRule]["qtyDiscount"] = qtyDiscountPositionBasis / wo.additionUnitObj.coefficient
                qtyDiscountComplectBasket -= qtyDiscountPositionBasis / setRule.quantity
            }
}
', 'import common.SetRule
import manage.Master

/*Check check
RuleLoyal ruleLoyal
WaresOrder waresOrder*/

SetRule setRule = waresOrder.interimData.get(ruleLoyal.codeRule)?.get("setRule")
BigDecimal qtyDiscount = waresOrder.interimData.get(ruleLoyal.codeRule)?.get("qtyDiscount")
if (setRule == null || qtyDiscount == null || qtyDiscount <= 0) return
BigDecimal priceWares = (ruleLoyal.typeUse == 0) ? waresOrder.price : waresOrder.sumPosition/waresOrder.quantity

Integer typeDiscount = setRule.typeDiscount
BigDecimal valueDiscount = setRule.n1

if (valueDiscount != null && typeDiscount != null) {
    if (typeDiscount == 0) {
        sumDiscount =  master.roundBigDecimal(qtyDiscount * priceWares * valueDiscount/100, 2)
    } else if (typeDiscount == 1) {
        sumDiscount = master.roundBigDecimal((priceWares - valueDiscount) * qtyDiscount , 2)
    } else if (typeDiscount == 2) {
        sumDiscount = valueDiscount * qtyDiscount
    }
}
discountStructure = [[qtyDiscount, sumDiscount]]
waresOrder.interimData[ruleLoyal.codeRule]["sumDiscount"] = sumDiscount', '/************* PARAMETERS - DO NOT REPLACE!!! *************************/
@Field int spread
spread =        #spread
/**********************************************************************/

import common.Check
import common.RuleLoyal
import common.WaresOrder
import groovy.transform.Field

/*
Check check
*/
void postCalculate () {
    if (spread == 0) spreadSet(check)
}

BigDecimal getFreeSumBL(WaresOrder wo) {
    return wo.sumPosition +
            (wo.discountList.get(ruleLoyal.codeRule)?.get("sumDiscount") ?: 0.00) -
            wo.quantity * (wo.priceDealerObj.indicativeActive == 1 ? (wo.priceDealerObj.indicativeMinPrice ?: 0) : 0)
}

Map getMapDiscountBL(WaresOrder wo, RuleLoyal ruleLoyal, BigDecimal sumDiscount) {
    BigDecimal sumPositionClean =  (ruleLoyal.typeUse == 0) ? (wo.price * wo.quantity) : (wo.sumPosition + wo.discountList.get(ruleLoyal.codeRule)?.get("sumDiscount")?:0.00)
    BigDecimal percentDiscount = (sumPositionClean.compareTo(BigDecimal.ZERO) == 0) ? 0.toBigDecimal() : master.roundBigDecimal(100 * sumDiscount / sumPositionClean, 6)
    return ["codeRule"   : ruleLoyal.codeRule,
            "percentDiscount" : percentDiscount,
            "sumDiscount": sumDiscount,
            "nameRule"   : ruleLoyal.nameRule,
            "typeAction" : 0,
            "typeUse"    : ruleLoyal.typeUse,
            "codeGroup"  : ruleLoyal.codeDiscountGroup,
            "sortNum"    : ruleLoyal.sortNum,
            "separate"   : (ruleLoyal.separate == (1 as short))]
}

List<WaresOrder> getWaresRule(){
    return check.waresOrderList.findAll { wo ->
        ruleLoyal.setRuleList
                .findAll {
                    ((it.typeValue == 0 && it.codeValue == wo.codeWares) ||
                            ( it.typeValue == 1 && it.codeValue in wo.waresExt.wares.codeGroupAll) ||
                            ( it.typeValue == 5 && wo.waresExt.waresProperty.find { wp -> wp.codeProperty == it.codeValue }))
                }.size() > 0
    }
}

void spreadSet(Check check) {
    BigDecimal sumDiscount = check.waresOrderList.findAll { it.discountList.containsKey(ruleLoyal.codeRule) }
            .collect { it.discountList.findAll {it.key == ruleLoyal.codeRule }.values() }
            .sum(0.00, { it[''sumDiscount''] })
    if (sumDiscount == 0) return

    List listN = getWaresRule().sort { wo -> -getFreeSumBL(wo) }
    spreadListBL(listN, sumDiscount)
}

void spreadListBL(List<WaresOrder> listN, BigDecimal sumDiscount) {
    BigDecimal sumDiscountBackup = sumDiscount
    BigDecimal sumN = listN.sum { WaresOrder wo -> getFreeSumBL(wo) }
    Map relWeight = listN.collectEntries { wo -> [(wo.num): getFreeSumBL(wo) / sumN] }

    Map<WaresOrder, BigDecimal> spreadSum = [:]
    listN.each { wo ->
        BigDecimal sumDiscountWares = (sumDiscountBackup * relWeight[wo.num]).setScale(2, BigDecimal.ROUND_DOWN)
        if (sumDiscountWares == 0) return
        sumDiscount -= sumDiscountWares
        spreadSum[wo] = sumDiscountWares
    }
    spreadSum.each { it ->
        if (sumDiscount == 0) return
        BigDecimal sumDiscountWares = [sumDiscount, getFreeSumBL(it.key) - it.value].min()
        it.value += sumDiscountWares
        sumDiscount -= sumDiscountWares
    }

    assert sumDiscount == 0

    spreadSum.each {
        it.key.discountList[ruleLoyal.codeRule] = getMapDiscountBL(it.key, ruleLoyal, it.value)
    }
}


', '{
    "input" : [
        {"name": "sort", "description": "Порядок сортировки по цене", "type": "fixedList", "list":{"0":"Без сортировки (сортировка по порядку ввода)", "1":"По убыванию", "2":"По возрастанию"},"defaultValue":"2"},
        {
            "name": "spread",
            "description": "Сумму скидки распределять на",
            "type": "fixedList",
            "list": {
            "0": "Пропорциональное распределение между товарами акции",
            "1": "Устанавливать каждому товару расчитанную для него скидку"
        },
            "defaultValue": "0"
        }
] ,
    "setRuleColumns" : [
        { "id": "nameTypeValue","label": "Тип данных" },
        { "id": "codeValue","label": "Код" },
        { "id": "nameValue","label": "Наименование" },
        { "id": "quantity","label": "Количество" },
        { "id": "nameTypeDiscount","label": "Тип скидки" },
        { "id": "n1","label": "Значение" }
],
    "setRuleTypeValues":[0,1,5]
}', null, 1, 0, 0, 0);
INSERT INTO pos.template_rule (code_template, name_template, before_wares_script, wares_calc_script, after_wares_script, param, code_event_list, sign_activity, version_row, type_template, use_template) VALUES (6, 'По сумме чека', 'check.interimData[ruleLoyal.codeRule] = [:]
check.interimData[ruleLoyal.codeRule]["members"] = []', '/************* PARAMETERS - DO NOT REPLACE!!! *************************/
@Field int typeDiscount
typeDiscount =        #typeDiscount
/**********************************************************************/

import common.SetRule
import common.WaresOrder
import groovy.transform.Field

void addMemberRule(WaresOrder wo) {
    if (!check.interimData[ruleLoyal.codeRule]["members"].contains(wo)) check.interimData[ruleLoyal.codeRule]["members"] << wo
}

String getTimeString(String begin, String end) {
    return "${begin ?: "00:00"}-${end ?: "23:59"}"
}

SetRule rangeSetRule = ruleLoyal.setRuleList.find{ it.numberSet == 1 &&
        ((it.n1 ?: 0.00) <= check.interimData["sumOrderOriginal"] && (it.n2 ?: 99999999.99) >= check.interimData["sumOrderOriginal"]) &&
        loyal.checkTimeActivity(getTimeString(it.s1, it.s2));
}
includeCondition = (ruleLoyal.setRuleList.findAll{it.numberSet == 2}.size() == 0 ||
        ruleLoyal.setRuleList
                .findAll{it.numberSet == 2}
                .find{(it.typeValue == 0 && it.codeValue == waresOrder.codeWares) ||
                        (it.typeValue == 1 && it.codeValue in waresOrder.waresExt.wares.codeGroupAll) ||
                        (it.typeValue == 5 && waresOrder.waresExt.waresProperty.find {wp -> wp.codeProperty == it.codeValue})} != null)
excludeCondition = (ruleLoyal.setRuleList
        .findAll{it.numberSet == 3}
        .find{(it.typeValue == 0 && it.codeValue == waresOrder.codeWares) ||
                (it.typeValue == 1 && it.codeValue in waresOrder.waresExt.wares.codeGroupAll) ||
                (it.typeValue == 5 && waresOrder.waresExt.waresProperty.find {wp -> wp.codeProperty == it.codeValue})} == null)

if (rangeSetRule != null && includeCondition && excludeCondition) {
    addMemberRule(waresOrder)
    BigDecimal priceWares = (ruleLoyal.typeUse == 0) ? waresOrder.price : waresOrder.sumPosition/waresOrder.quantity
    int typeDiscountValue = (rangeSetRule.typeDiscount == null) ? typeDiscount : rangeSetRule.typeDiscount
    BigDecimal valueDiscount = rangeSetRule.n3
    if (valueDiscount == null) return
    if (typeDiscountValue == 0) {
        BigDecimal percentDiscount = valueDiscount
        sumDiscount = master.roundBigDecimal(priceWares * waresOrder.quantity * percentDiscount / 100, 6)
    } else if (typeDiscountValue == 1) {
        sumDiscount = master.roundBigDecimal((priceWares - valueDiscount) * waresOrder.quantity, 6)
    } else if (typeDiscountValue == 2) {
        sumDiscount = valueDiscount * waresOrder.quantity
    }
}
', null, '{
    "input" : [
        {"name": "typeDiscount", "description": "Тип скидки","type":"listFromDB","codeReport":159}
        ] ,        
    "setRule" : {
      "1": {"name": "Диапазоны",  "setRuleColumns" : [
            { "id": "nameTypeValue","label": "Тип данных" },
            { "id": "n1","label": "Начальная сумма" },
            { "id": "n2","label": "Конечная сумма" },
            { "id": "s1","label": "Начальное время", "type": "time" },
            { "id": "s2","label": "Конечное время", "type": "time" },
            { "id": "nameTypeDiscount","label": "Тип скидки" },
            { "id": "n3","label": "Значение" }
            ],
          "setRuleTypeValues":[6],
          "setRuleSortColumns": ["n1" , "s1"],
          "setRuleUniqueFields": ["typeValue","n1","s1"]
      }, 
      "2": {"name": "Товары для скидки","setRuleTypeValues":[0,1,5]}, 
      "3": {"name": "Товары-исключения","setRuleTypeValues":[0,1,5]}
    },
  "setRuleColumns" : [
            { "id": "nameTypeValue","label": "Тип данных" },
            { "id": "codeValue","label": "Код" },
            { "id": "nameValue","label": "Наименование" }
            ]  
}
', null, 1, 0, 0, 0);
INSERT INTO pos.template_rule (code_template, name_template, before_wares_script, wares_calc_script, after_wares_script, param, code_event_list, sign_activity, version_row, type_template, use_template) VALUES (7, 'Округление чека', null, null, '/************* PARAMETERS - DO NOT REPLACE!!! *************************/
@Field String text
/**********************************************************************/

import common.Check
import common.WaresOrder
import groovy.transform.Field
import manage.Master
import org.json.simple.parser.JSONParser

/*******************************
 * 0 - математическое округление
 * 1 - только вверх
 * 2 - только вниз
 ******************************/

String vatOpt = master.getOptions().getString("VAT_ROUND", "");
if (vatOpt == null || vatOpt.isEmpty()) {
    check.disablePrintCheckReason[ruleLoyal.codeRule] = "Не заданы настройки округления чека. Обратитесь в службу тех.поддержки"
    return
}

//Check check

check.orderClient.sumDiscountRound = 0.00
check.orderClient.addInfo.remove("sumDiscountRound")
check.messageSaleCheck.remove(ruleLoyal.codeRule)
check.calcSumCheck()

BigDecimal sumOrder = check.orderClient.sumOrder
BigDecimal sumNotCashPay = check.orderPayList.findAll({it.typePay != 0}).sum{it.sumPay} ?: 0.00
BigDecimal sumCashPay = sumOrder - sumNotCashPay
check.orderClient.sumDiscountRound = sumCashPay - master.getRoundCashSum(sumCashPay, check)
master.log("round sum $check.orderClient.sumDiscountRound")
if (check.orderClient.sumDiscountRound == 0.00)  return

JSONParser json = new JSONParser();
Map<String, BigDecimal> map = check.waresOrderList
        .groupBy {it.vatOperation}
        .collectEntries { k, v -> [(k as String): v.sum{it.sumPosition/check.sumOrder}]}
Map<String, Map<String, Object>> opt = json.parse(vatOpt)
check.waresOrderList.each {
    it.discountList.remove(ruleLoyal.codeRule)
    if (it.addInfo == null) it.addInfo = [:] else it.addInfo.remove("sumDiscountRound")
    if (opt[it.vatOperation as String]["controlMRP"]) {
        BigDecimal sumPayAccount = it.payInfo.values().sum(0.0, {it?:0.00})
        it.interimData["minSumPosition"] = ((it.priceDealerObj?.indicativeActive == 1 && it.priceDealerObj?.indicativeMinPrice != null) ? it.priceDealerObj?.indicativeMinPrice : 0) * it.quantity + sumPayAccount
        it.interimData["maxSumPosition"] = ((it.priceDealerObj?.indicativeActive == 1 && it.priceDealerObj?.indicativeMaxPrice != null) ? it.priceDealerObj?.indicativeMaxPrice : 100000.00) * it.quantity
    } else {
        it.interimData["minSumPosition"] = 0.00
        it.interimData["maxSumPosition"] = 100000.00
    }
}

List getListVatModeRound(Map<String, Map<String, Object>> opt, List<String> list) {
    return opt.findAll {k,v -> (v["modeRound"] as String) in list}.keySet().collect()
}

Map<String, BigDecimal> getCanDiscountVat(Check check, String key, List listVat){
    return check.waresOrderList.findAll{(it.quantity > 0) && ((it.vatOperation as String) in listVat)}
            .groupBy {it.vatOperation}
            .collectEntries { k, v ->
                [(k as String): v.sum {
                    Math.abs(it.sumPosition - it.interimData[key])
                }]} as Map<String, BigDecimal>
}

Map<String, BigDecimal> getProportionSum(Check check, String key, Map<String, BigDecimal> canDiscountVat, List listVat){
    BigDecimal canDiscountAll = canDiscountVat.values().sum()
    return check.waresOrderList.findAll{(it.quantity > 0) && ((it.vatOperation as String) in listVat) && canDiscountVat[it.vatOperation as String] >= 0.01}
            .groupBy {it.vatOperation}
            .collectEntries {k, v -> [(k as String): v.sum{Math.abs(it.sumPosition - it.interimData[key])/canDiscountAll}]} as Map<String, BigDecimal>
}

BigDecimal applyDiscountVatGroup(check, String vatGroup, BigDecimal sumDiscount, String typeKey) {
    BigDecimal sumApplyDiscountVatGroup = 0.00
    check.waresOrderList.findAll{(it.quantity > 0) && (it.vatOperation as String == vatGroup)}
            .sort{a,b-> (b.sumPosition - b.interimData[typeKey]) <=> (a.sumPosition - a.interimData[typeKey])}
            .each{wo ->
                if (sumDiscount == 0) return
                BigDecimal sumApplyDiscountWares = discount(wo, sumDiscount, typeKey)
                sumDiscount -= sumApplyDiscountWares
                sumApplyDiscountVatGroup += sumApplyDiscountWares
            }
    return sumApplyDiscountVatGroup
}

BigDecimal mainSpread(Check check, Map<String, BigDecimal> proportionSum, String typeKey) {
    BigDecimal primaryDiscount = check.orderClient.sumDiscountRound
    proportionSum.each {key, value ->
        if (primaryDiscount == 0.00) return
        BigDecimal sumDiscount = Master.roundBigDecimal(primaryDiscount * value, 2);
        primaryDiscount -= applyDiscountVatGroup(check, key, sumDiscount, typeKey)
    }
    return primaryDiscount
}

BigDecimal discount(WaresOrder wo, BigDecimal sumDiscount, String typeKey) {
    BigDecimal prevDiscount = wo.discountList.get(ruleLoyal.codeRule)?.get("sumDiscount") ?: 0.00
    BigDecimal sumApplyDiscount = Master.roundBigDecimal(Math.signum(sumDiscount) * [Math.abs(wo.sumPosition - (wo.interimData[typeKey] as BigDecimal)) , Math.abs(sumDiscount)].min(),2)
    wo.discountList[ruleLoyal.codeRule] = loyal.createAdditionDiscount(wo, ruleLoyal, prevDiscount + sumApplyDiscount, null);
    wo.discountList[ruleLoyal.codeRule]["rounding"] = true
    if (wo.addInfo == null) wo.addInfo = [:]
    wo.addInfo["sumDiscountRound"] = (wo.addInfo["sumDiscountRound"] ?: 0.00) + sumApplyDiscount
    master.log("wares ${wo.codeWares}, sum round discount : ${sumApplyDiscount}")
    return (sumApplyDiscount)
}


void additionSpread (Check check, Map<String, BigDecimal> proportionSum, String typeKey, BigDecimal primaryDiscount) {
    if (primaryDiscount == 0) return
    master.log("осталось разбросать ${primaryDiscount}")
    proportionSum.each {key, value ->
        if (primaryDiscount == 0.00) return
        BigDecimal sumDiscount = Master.roundBigDecimal(primaryDiscount , 2);
        primaryDiscount -= applyDiscountVatGroup(check, key, sumDiscount, typeKey)
    }
}

String key
List listVat
if (check.orderClient.sumDiscountRound > 0){
    key = "minSumPosition"
    listVat =  getListVatModeRound(opt,  ["0","2"])
} else {
    key = "maxSumPosition"
    listVat =  getListVatModeRound(opt,  ["0","1"])
}
Map<String, BigDecimal> canDiscountVat = getCanDiscountVat(check, key, listVat)
Map<String, BigDecimal> proportionSum = getProportionSum(check, key, canDiscountVat, listVat)
BigDecimal primaryDiscount = mainSpread(check, proportionSum, key)
check.calcSumCheck()
additionSpread(check, proportionSum, key, primaryDiscount)

text =        """#text"""
check.messageSaleCheck[ruleLoyal.codeRule] = """$text"""
check.orderClient.addInfo["sumDiscountRound"] = check.orderClient.sumDiscountRound
check.calcSumCheck()

sumOrder = check.orderClient.sumOrder
sumNotCashPay = check.orderPayList.findAll({it.typePay != 0}).sum{it.sumPay} ?: 0.00
sumCashPay = sumOrder - sumNotCashPay;
BigDecimal sumDiscount = (check as Check).waresOrderList
        .collect {(it.discountList as Map<String, Map<String, Object>>).values()}
        .flatten()
        .findAll{d -> d["codeRule"] == ruleLoyal.codeRule }
        .sum(0.00, {d -> d["sumDiscount"]});
if (check.orderClient.sumDiscountRound != sumDiscount) {
    check.orderClient.addInfo.remove("sumDiscountRound")
    check.disablePrintCheckReason[ruleLoyal.codeRule] = "Невозможно округлить чек. Переформируйте оплаты или обратитесь в службу тех.поддержки"
}
', '{
  "input": [
    {
      "name": "text",
      "description": "Текст сообщения",
      "type": "string",
      "rows": 4,
      "detail": "Можно использовать: ${sumCashPay} - сумма товаров, оплаченных наличными"
    }
  ],
  "codeEventList": [
    58,
    59
  ],
  "separate": 1
}', null, 1, 0, 0, 1);
INSERT INTO pos.template_rule (code_template, name_template, before_wares_script, wares_calc_script, after_wares_script, param, code_event_list, sign_activity, version_row, type_template, use_template) VALUES (8, 'Распределение оплаты бонусами по товарам', 'def log (text) {
    boolean isLog = true
    if (isLog) master.log(text)
}

def listPaySplit = []
check.orderPayList.each() { pay->
    if ((pay.methodPayRro == 2) && !listPaySplit.contains(pay.typePay)) listPaySplit << pay.typePay
}

check.waresOrderList.each{ it.payInfo = [:] }

listPaySplit.each() { typePay->
    def sumPay = 0.00
    check.waresOrderList.each() { wr->
        if (wr.isDeleted) return
        wr.payInfo[typePay] = 0.00
    }
    def namePay = ""
    check.orderPayList.each() { pay->
        if ((pay.methodPayRro == 2) && (pay.typePay == typePay)) {
            sumPay += pay.sumPay
            namePay = pay.namePay
        }
    }
    if (sumPay == 0) return
    log("версия скрипта оплаты по товарам: 10")
    def sumRest = sumPay
    def sumOrderCanPay = 0.00
    def sumOrderCanPayWares = 0.00
    def sumOrderCanPayOrder = 0.00

    //посчитаем сумму которую можно оплатить вирт деньгами
    check.waresOrderList.each() { wr->
        if (wr.isDeleted) return
        def newSum = [(wr.sumPosition - wr.minSumPayReal) , 0.00].max()   //защита от скидки ниже границы индикатива
        sumOrderCanPayWares += newSum
        wr.payInfo[typePay] = 0.00
    }

    sumOrderCanPay = sumOrderCanPayWares         //для расчета удельных весов используем сумму по товарам.
    //разбросаем скидку по позициям
    log("Сумма чека ${check.orderClient.sumOrder}, можем оплатить $sumOrderCanPay , сумма оплаты бонусами $sumPay")
    check.waresOrderList.each() { wr->
        if (wr.isDeleted) return
        def newSum = [(wr.sumPosition - wr.minSumPayReal) , 0.00].max()   //защита от скидки ниже границы индикатива
        def udves = newSum/sumOrderCanPay
        log("ТОвар $wr.num : $wr.nameWares, сумма позиции: $wr.sumPosition, мин.сумма: $wr.minSumPayReal")
        log("                               удельный вес $udves")
        def sumDiscountPay = [(udves * sumPay).setScale(2,BigDecimal.ROUND_DOWN), newSum].min()  //защита от скидки большей суммы позиции
        if (sumDiscountPay <= 0 ) return
        sumRest -= sumDiscountPay
        wr.payInfo[typePay] += sumDiscountPay
        log("                               sumDiscountPay : $sumDiscountPay")
        log("                               wr.payInfo[typePay] : ${wr.payInfo[typePay]}")
    }

    //если остались копейки разбросаем их
    log("Разбрасываем копейки : $sumRest")
    while (sumRest > 0) {
        check.waresOrderList.each() { wr->
            if (wr.isDeleted) return
            if (sumRest > 0) {
                log("ТОвар $wr.num : $wr.nameWares")
                def canPay = wr.sumPosition - wr.minSumPayReal - wr.payInfo[typePay]
                log("                              canPay : ${canPay}")
                if (canPay < 0.01) return
                wr.payInfo[typePay] += 0.01
                sumRest -= 0.01
                log("                              wr.payInfo[typePay] : ${wr.payInfo[typePay]}")
            }
        }
    }
    check.waresOrderList.each() {
        if (it.payInfo[typePay] == null || it.payInfo[typePay] == 0) return
        it.messageSaleCheck[typePay]="Оплачено $namePay: "+ it.payInfo[typePay]
    }
}', null, null, '{
    "input" : [] ,        
    "codeEventList" : [58]
}', null, 1, 0, 0, 1);
INSERT INTO pos.template_rule (code_template, name_template, before_wares_script, wares_calc_script, after_wares_script, param, code_event_list, sign_activity, version_row, type_template, use_template) VALUES (9, 'Активация, пополнение, контроль продажи сертификатов', 'import common.Certificate
import common.Check
import common.WaresOrder
import gui.market.GuiModule

import java.text.SimpleDateFormat

GuiModule gui = master.gui
WaresOrder wo = values["waresOrder"] as WaresOrder
if (wo == null) return

List listWaresCertSale = ruleLoyal.setRuleList.findAll{it.numberSet == 1 && it.typeValue == 0}.collect{it.codeValue}
List listWaresRefill = ruleLoyal.setRuleList.findAll{it.numberSet == 2 && it.typeValue == 0}.collect{it.codeValue}
boolean certificatePresent = ((check as Check).waresOrderList.find{it.codeWares in listWaresCertSale || it.codeWares in listWaresRefill} != null)
if (!certificatePresent) return

/** контроль в момент сканирования*/
if (wo == null) return
Certificate certificate = wo.interimData["certificate"]
if (check.waresOrderList.size() > 1) {
    check.waresOrderList.remove(wo)
    gui.showMessage(gui.waresCheckStage, "Запрещено продавать сертификат с другими товарами")
    return
}
if (certificate == null) {
    check.waresOrderList.remove(wo)
    gui.showMessage(gui.waresCheckStage, "Товар-сертификат не найден в чеке")
    return
}
if (certificate.signActivity == (1 as short) && (wo.codeWares in listWaresCertSale)) {
    check.waresOrderList.remove(wo)
    gui.showMessage(gui.waresCheckStage, "Сертификат уже активирован. Продажа запрещена")
    return
}

boolean isDateActive(Date begin, Date end) {
    SimpleDateFormat df = new SimpleDateFormat("dd.MM.yyyy")
    Date today = df.parse( df.format(new Date()))
    return (begin == null || today >= df.parse( df.format(begin))) && (end == null || today <= df.parse(df.format(end)))
}

if (!isDateActive(certificate.dateBegin, certificate.dateEnd)) {
    check.waresOrderList.remove(wo)
    gui.showMessage(gui.payFormStage, "Сертификат неактивен по срокам действия. Оплата невозможна")
    return
}

wo.addInfo["codeCert"] = certificate.codeCert
wo.enableEditQuantity = false', 'import common.Certificate
import common.CreditAccount
import common.Pay

/** активация и попополнение*/
List listWaresCertSale = ruleLoyal.setRuleList.findAll{it.numberSet == 1 && it.typeValue == 0}.collect{it.codeValue}
List listWaresRefill = ruleLoyal.setRuleList.findAll{it.numberSet == 2 && it.typeValue == 0}.collect{it.codeValue}

Certificate certificate = waresOrder.interimData["certificate"]
if (!(waresOrder.codeWares in listWaresCertSale || waresOrder.codeWares in listWaresRefill) || certificate == null) return
Pay pay = master.attrib.listPay[certificate.typePay] as Pay
int codeTypeAccount  = pay.codeTypeAccount
BigDecimal sumCredit = waresOrder.price * waresOrder.quantity
int codeCert = certificate.codeCert
def key = "$ruleLoyal.codeRule:$codeTypeAccount:${codeCert}"
waresOrder.creditInfo[key]  = [codeRule: ruleLoyal.codeRule, codeTypeAccount: codeTypeAccount, sumCredit: sumCredit, codeClient: codeCert]
if (check.addSumAccountList[key]  != null) check.addSumAccountList[key].sumCredit += sumCredit
else check.addSumAccountList[key] = new CreditAccount(codeRule: ruleLoyal.codeRule,
        codeTypeAccount: codeTypeAccount,
        sumCredit: sumCredit,
        delayCredit : 0,
        online: true,
        codeClient: codeCert)', null, '{
    "input" : [] ,        
    "setRule" : {"1": {"name": "Сертификаты для продажи"}, "2": {"name": "Пополняемые сертификаты"}},
    "setRuleColumns" : [
            { "id": "nameTypeValue","label": "Тип данных" },
            { "id": "codeValue","label": "Код" },
            { "id": "nameValue","label": "Наименование" }
            ]     
}', null, 1, 0, 0, 1);
INSERT INTO pos.template_rule (code_template, name_template, before_wares_script, wares_calc_script, after_wares_script, param, code_event_list, sign_activity, version_row, type_template, use_template) VALUES (10, 'Скидка', null, '/************* PARAMETERS - DO NOT REPLACE!!! *************************/
@Field boolean checkIndicative
checkIndicative = ("#checkIndicative" == "true")
/**********************************************************************/

import groovy.transform.Field
import manage.Master

//waresOrder.loyalInfo[ruleLoyal.codeRule]=[''codeRule'':ruleLoyal.codeRule]

void setSumUnrealizedDiscount(BigDecimal sumUnrealizedDiscount) {
    if (waresOrder.interimData[ruleLoyal.codeRule] == null) waresOrder.interimData[ruleLoyal.codeRule] = [:]
    waresOrder.interimData[ruleLoyal.codeRule]["sumUnrealizedDiscount"] = sumUnrealizedDiscount
}

setSumUnrealizedDiscount(0.00)
if (sumDiscount != null) {
    BigDecimal correctedSum = (checkIndicative ? loyal.correctSumDiscountByIndicative(waresOrder, sumDiscount) : sumDiscount)
    if (discountStructure != null && discountStructure.size > 0) {
        BigDecimal coef = correctedSum/sumDiscount
        discountStructure.each {
            it[1] = Master.roundBigDecimal(it[1] * coef, 2)
        }
        BigDecimal mistake = correctedSum - discountStructure.sum(0.00, {it[1]})
        discountStructure.sort {-it[1]/it[0]}.first()[1] += mistake
        assert discountStructure.sum(0.00, {it[1]}) == correctedSum
    }
    loyal.setDiscount(check, ruleLoyal, waresOrder, correctedSum, discountStructure)
    setSumUnrealizedDiscount(sumDiscount - correctedSum)
} else if (price != null) {
    BigDecimal correctedPrice = checkIndicative ? loyal.correctPriceByIndicative(waresOrder, price) : price
    loyal.setPrice(check, ruleLoyal, waresOrder, correctedPrice)
    setSumUnrealizedDiscount((price - correctedPrice) * waresOrder.quantity)
}
', '/************* PARAMETERS - DO NOT REPLACE!!! *************************/
/**
 * распределение недоначисленной скидки
 * 0 - не распределять
 * 1 - распределять по товарам текущей акции
 * 2 - распределять по товарам всего чека
 */
@Field Integer spreadUnrealizedMode
spreadUnrealizedMode = #spreadUnrealizedMode
/********************************************************************/

import common.Check
import common.RuleLoyal
import common.Wares
import common.WaresOrder
import groovy.transform.Field
import manage.Master

void spreadUnrealizedDiscount(){
    BigDecimal sumDiscount = check.waresOrderList
            .findAll{it.discountList.containsKey(ruleLoyal.codeRule)}
            .sum(0.00, {it.interimData[ruleLoyal.codeRule]["sumUnrealizedDiscount"]?:0.00})
    if (sumDiscount == 0.00) return
    if (spreadUnrealizedMode == null || spreadUnrealizedMode == 0) {
        Map<WaresOrder, BigDecimal> listWares = check.interimData[ruleLoyal.codeRule]["members"].unique().groupBy {it.codeWares}
                .collect{ [(it.key) : it.value.sum{wo-> wo.interimData[ruleLoyal.codeRule]["sumUnrealizedDiscount"]?:0.00}]}
                .collectEntries()
        listWares.each {
            List<WaresOrder> list = check.interimData[ruleLoyal.codeRule]["members"].unique().findAll{wo -> wo.codeWares == it.key}
            spreadList(list, it.value)
        }
    } else if (spreadUnrealizedMode == 1){
        List<WaresOrder> list = check.interimData[ruleLoyal.codeRule]["members"].sort{-getFreeSum(it)}.unique()
        spreadList(list, sumDiscount)
    } else if (spreadUnrealizedMode == 2){
        List<WaresOrder> list = check.waresOrderList.sort{-getFreeSum(it)}
        spreadList(list, sumDiscount)
    }
}

BigDecimal getFreeSum(WaresOrder wo) {
    return wo.sumPosition - wo.quantity * (wo.priceDealerObj.indicativeActive == 1 ? (wo.priceDealerObj.indicativeMinPrice ?: 0) : 0)
}

Map getMapDiscount(WaresOrder wo, RuleLoyal ruleLoyal, BigDecimal sumDiscount) {
    BigDecimal sumPositionClean =  (ruleLoyal.typeUse == 0) ? (wo.price * wo.quantity) : (wo.sumPosition + (wo.discountList?.get(ruleLoyal.codeRule)?.get("sumDiscount")?:0.00))
    BigDecimal percentDiscount = (sumPositionClean.compareTo(BigDecimal.ZERO) == 0) ? 0.toBigDecimal() : Master.roundBigDecimal(100 * sumDiscount / sumPositionClean, 6)
    return ["codeRule"   : ruleLoyal.codeRule,
            "percentDiscount" : percentDiscount,
            "sumDiscount": sumDiscount,
            "nameRule"   : ruleLoyal.nameRule,
            "typeAction" : 0,
            "typeUse"    : ruleLoyal.typeUse,
            "codeGroup"  : ruleLoyal.codeDiscountGroup,
            "sortNum"    : ruleLoyal.sortNum,
            "separate"   : (ruleLoyal.separate == (1 as short))]
}

void spreadList(List<WaresOrder> listN, BigDecimal sumDiscount) {
    BigDecimal sumDiscountBackup = sumDiscount
    listN.each {it.discountList.get(ruleLoyal.codeRule)?.put("discountStructure", [])}
    BigDecimal sumN = listN.sum { WaresOrder wo -> getFreeSum(wo) }
    if (sumN <= 0.00) return
    Map relWeight = listN.collectEntries { wo -> [(wo.num): getFreeSum(wo) / sumN] }

    Map<WaresOrder, BigDecimal> spreadSum = [:]
    listN.each { wo ->
        BigDecimal sumDiscountWares = master.roundBigDecimal([(sumDiscountBackup * relWeight[wo.num]).setScale(2, BigDecimal.ROUND_DOWN), getFreeSum(wo)].min() ,2)
        if (sumDiscountWares == 0) return
        sumDiscount -= sumDiscountWares
        spreadSum[wo] = sumDiscountWares
    }
    spreadSum.each { it ->
        if (sumDiscount == 0) return
        BigDecimal sumDiscountWares = master.roundBigDecimal([sumDiscount, getFreeSum(it.key) - it.value].min(),2)
        it.value += sumDiscountWares
        sumDiscount -= sumDiscountWares
    }
    assert sumDiscount == sumDiscountBackup - spreadSum.values().sum(0.00, {it})
    spreadSum.each {
        if (it.key.discountList[ruleLoyal.codeRule] == null) {
            it.key.discountList[ruleLoyal.codeRule] = getMapDiscount(it.key, ruleLoyal, it.value)
        } else {
            BigDecimal newSumDiscount = master.roundBigDecimal(it.key.discountList[ruleLoyal.codeRule]["sumDiscount"] +  it.value,2)
            BigDecimal sumPositionClean =  (ruleLoyal.typeUse == 0) ? (it.key.price * it.key.quantity) : (it.key.sumPosition + it.key.discountList.get(ruleLoyal.codeRule)?.get("sumDiscount")?:0.00)
            BigDecimal percentDiscount = (sumPositionClean.compareTo(BigDecimal.ZERO) == 0) ? 0.toBigDecimal() : Master.roundBigDecimal(100 * newSumDiscount / sumPositionClean, 6)
            it.key.discountList[ruleLoyal.codeRule]["sumDiscount"] = newSumDiscount
            it.key.discountList[ruleLoyal.codeRule]["percentDiscount"] = percentDiscount
        }
        it.key.discountList[ruleLoyal.codeRule]["discountStructure"] = []
    }
}
', '{
  "input": [
    {
      "name": "spreadUnrealizedMode",
      "description": "Распределение недоначисленной скидки",
      "type": "fixedList",
      "list": {
        "0": "Не распределять",
        "1": "Распределять по товарам текущей акции",
        "2": "Распределять по товарам всего чека"
      },
      "defaultValue": "0"
    },
    {
      "name": "checkIndicative",
      "description": "Учитывать индикатив",
      "type": "boolean",
      "defaultValue": true,
      "codeEvent": 104 
    }    
  ],
  "disableDuplication": true
}', null, 1, 0, 1, 0);
INSERT INTO pos.template_rule (code_template, name_template, before_wares_script, wares_calc_script, after_wares_script, param, code_event_list, sign_activity, version_row, type_template, use_template) VALUES (11, 'Начислить на счет', null, 'int codeTypeAccount = #typeAccount

if (check.state == 2 &&
        check.client != null &&
        sumDiscount != null &&
        sumDiscount > 0 &&
        (waresOrder.interimData.get("disableCreditAccount")?.get(codeTypeAccount) == null || waresOrder.interimData.get("disableCreditAccount")?.get(codeTypeAccount) == false )) {
    BigDecimal sumCredit = sumDiscount
    if (sumCredit <= 0.00) return
    int codeClient = check.client.codeClient
    Integer codeRule = ruleLoyal.codeRule
    String key = "$codeRule:${codeTypeAccount}:${codeClient}"
    waresOrder.creditInfo[key] = [codeRule: codeRule, codeTypeAccount: codeTypeAccount, sumCredit: sumCredit, codeClient: codeClient]
    if (check.addSumAccountList[key] != null) check.addSumAccountList[key].sumCredit += sumCredit
    else check.addSumAccountList[key] = new common.CreditAccount(codeRule: codeRule,
            codeTypeAccount: codeTypeAccount,
            sumCredit: sumCredit,
            delayCredit: 0,
            online: true,
            codeClient: codeClient)
}', null, '{
    "input" : [ {"name":"typeAccount","description":"Счет","type":"listFromDB","codeReport":158}], 
    "disableDuplication": true
}', null, 1, 0, 1, 0);
INSERT INTO pos.template_rule (code_template, name_template, before_wares_script, wares_calc_script, after_wares_script, param, code_event_list, sign_activity, version_row, type_template, use_template) VALUES (12, 'Сообщение кассиру', null, null, 'if (check.waresOrderList.size() > 0 ) {
    BigDecimal sumDiscount = check.waresOrderList.findAll{it.discountList.containsKey(ruleLoyal.codeRule)}
            .collect{it.discountList.values()}
            .sum(0.00, {it[''sumDiscount'']})
    String value = ''#sumDiscount''
    if (value == '''' || (sumDiscount >= new BigDecimal(value))) {
        def key = """$ruleLoyal.codeRule-#text"""
        def countShowed = 0
        if (check.orderClient.interimData[key] != null) countShowed = check.orderClient.interimData[key] else countShowed = 0
        if ((check.state == #state || #state == -1 ) && (countShowed == 0)) {
            master.gui.showMessage("""#text""")
            check.orderClient.interimData[key] = countShowed + 1
        }
    }
}', '{
    "input" : [
        {"name": "text", "description": "Текст сообщения", "type": "string", "rows" : 3, "detail":"Можно использовать: ${sumDiscount} - сумма скидки" },
        {"name":"sumDiscount", "description":"Сумма скидки от ,грн", "type": "number"},        
        {"name": "state", "description": "Когда показывать", "type": "fixedList", "list":{"-1":"В любом состоянии чека", "0":"Набор товаров", "1":"Перед оплатой","2":"После оплаты"}}
    ]
}

', null, 1, 0, 1, 0);
INSERT INTO pos.template_rule (code_template, name_template, before_wares_script, wares_calc_script, after_wares_script, param, code_event_list, sign_activity, version_row, type_template, use_template) VALUES (13, 'Сообщение на чеке', null, null, 'String nameKassir = master.auth.currentUser.fio
String codeUser = master.auth.currentUser.codeUser as String
String numberKassir = codeUser.size() > 2 ? codeUser.substring(2) : codeUser
if (check.waresOrderList.size() > 0) {
    BigDecimal sumDiscount = check.waresOrderList.findAll{it.discountList.containsKey(ruleLoyal.codeRule)}
            .collect{it.discountList.values()}
            .sum(0.00, {it[''sumDiscount'']})
    String value = ''#sumDiscount''
    if (value == '''' || (sumDiscount >= new BigDecimal(value))) {
        if (#typePrint == 0) {
            check.messageSaleCheck[ruleLoyal.codeRule] = """#text"""
        } else if (#typePrint == 1) {
            check.messageSplitCheck[ruleLoyal.codeRule] = """#text"""
        }   
    } 
}

', '{
    "input" : [
        {"name": "text", "description": "Текст сообщения", "type": "string", "rows" : 3, "detail":"Можно использовать: ${sumDiscount} - сумма скидки; ${nameKassir} - ФИО кассира; ${numberKassir} - номер кассира" },
        {"name":"sumDiscount", "description":"Cумма скидки от ,грн", "type": "number"},        
        {"name": "typePrint", "description": "Где печатать", "type": "fixedList", "list":{"0":"В конце чека", "1":"В отдельном чеке"}}
    ],
    "disableDuplication": true               
}', null, 1, 0, 1, 0);
INSERT INTO pos.template_rule (code_template, name_template, before_wares_script, wares_calc_script, after_wares_script, param, code_event_list, sign_activity, version_row, type_template, use_template) VALUES (14, 'Сумма чека', 'if (!(check.interimData["sumOrderOriginal"] #compare #sumOrder)) return', 'if (!(check.interimData["sumOrderOriginal"] #compare #sumOrder)) return', 'if (!(check.interimData["sumOrderOriginal"] #compare #sumOrder)) return', '{
    "input" : [
        {"name": "compare", "description": "Сумма чека", "type": "fixedList", "list":{">":">", "<":"<", "==":"=", "!=":"!=", ">=":">=", "<=":"<="}},
        {"name":"sumOrder", "description":"Значение", "type": "number"}
    ],
    "disableDuplication": true           
}', null, 1, 0, 2, 0);
INSERT INTO pos.template_rule (code_template, name_template, before_wares_script, wares_calc_script, after_wares_script, param, code_event_list, sign_activity, version_row, type_template, use_template) VALUES (15, 'Свободная цена(установка скидки)', 'import common.UserPos
import common.Wares
import common.WaresOrder
import common.SetRule

private boolean isEnableChangePrice(WaresOrder wo) {
    SetRule setRule = ruleLoyal.setRuleList
            .findAll{it.numberSet == 1}
            .find{(it.typeValue == 0 && it.codeValue == wo.codeWares) || 
                  (it.typeValue == 1 && it.codeValue in wo.waresExt.wares.codeGroupAll) ||
                  (it.typeValue == 5 && wo.waresExt.waresProperty.find {wp -> wp.codeProperty == it.codeValue})}
    SetRule setRuleExclude = ruleLoyal.setRuleList
            .findAll{it.numberSet == 2}
            .find{(it.typeValue == 0 && it.codeValue == wo.codeWares) || 
                  (it.typeValue == 1 && it.codeValue in wo.waresExt.wares.codeGroupAll) ||
                  (it.typeValue == 5 && wo.waresExt.waresProperty.find {wp -> wp.codeProperty == it.codeValue})}
    return (setRule != null && setRuleExclude == null)
}

private void setPrice(WaresOrder wo, int codeEvent) {
    if (!isEnableChangePrice(wo)) {
        master.gui.showMessage(master.gui.waresCheckStage, "Для этой группы товаров ручная скидка запрещена")
        return
    }
    if (!wo.signNew) {
        master.gui.showMessage(master.gui.waresCheckStage, "Можно задавать свободную цену только для последнего товара")
        return
    }
    UserPos user = master.auth.checkAccess(master.gui.waresCheckStage, codeEvent);
    if (user == null) {
        master.gui.showMessage(master.gui.waresCheckStage, master.getResourceValue(master.langResource, ''notaccess'', "Нет доступа"))
        return;
    }
    def newPrice = -1.00
    String inputValue = master.gui.showInputNumber(master.gui.waresCheckStage, "Введите цену", null);
    if (inputValue == null || inputValue.length() == 0) return
    try {
        newPrice = master.roundBigDecimal(inputValue as BigDecimal, 2)
    } catch (ex) {
        master.log(ex)
    }

    if (newPrice < 0) {
        master.gui.showMessage(master.gui.waresCheckStage, "Некорректное значение цены")
        return
    }

    BigDecimal minPrice = wo.priceDealerObj.indicativeMinPrice == null ? 0.00 : master.roundBigDecimal(wo.priceDealerObj.indicativeMinPrice, 2);
    BigDecimal maxPrice = wo.priceDealerObj.indicativeMaxPrice == null ? 99999999 : master.roundBigDecimal(wo.priceDealerObj.indicativeMaxPrice, 2);

    if (wo.priceDealerObj.indicativeActive == 1 && (newPrice < minPrice || newPrice > maxPrice)) {
        String minPriceText = wo.priceDealerObj.indicativeMinPrice == null ? "не задано" : master.roundBigDecimal(wo.priceDealerObj.indicativeMinPrice, 2);
        String maxPriceText = wo.priceDealerObj.indicativeMaxPrice == null ? "не задано" : master.roundBigDecimal(wo.priceDealerObj.indicativeMaxPrice, 2);
        master.gui.showMessage(master.gui.waresCheckStage, "Заданная цена ${newPrice} выходит за границы индикатива: min = ${minPriceText}; max = ${maxPriceText}")
        return
    }
    wo.interimData[ruleLoyal.codeRule] = [:]
    wo.interimData[ruleLoyal.codeRule]["freePriceByDiscount"] = newPrice
    def audit = master.createAudit();
    audit.codeEvent = codeEvent
    audit.codeWares = wo.codeWares
    audit.quantity = wo.quantity
    audit.codeUnit = wo.codeUnit
    audit.price = wo.price
    audit.codeUser = user.codeUser
    master.auth.insAudit(audit)
}

WaresOrder wo = values["waresOrder"]
Integer codeRule = values["codeRule"] as Integer
if (wo == null || codeRule == null || codeRule != ruleLoyal.codeRule) return
int codeEvent = check.orderClient.typeOrder == 0 ? 65 : 80
setPrice(wo,codeEvent)
', 'BigDecimal newPrice = waresOrder.interimData.get(ruleLoyal.codeRule)?.get("freePriceByDiscount") as BigDecimal
if (newPrice == null || newPrice <= 0) return
BigDecimal priceWares = (ruleLoyal.typeUse == 0) ? waresOrder.price : waresOrder.sumPosition/waresOrder.quantity
sumDiscount = priceWares * waresOrder.quantity - newPrice * waresOrder.quantity
', null, '{
    "setRule" : {"1": {"name": "Товары для скидки"}, "2": {"name": "Товары-исключения"}},
    "setRuleColumns" : [
            { "id": "nameTypeValue","label": "Тип данных" },
            { "id": "codeValue","label": "Код" },
            { "id": "nameValue","label": "Наименование" }
            ] ,
    "setRuleTypeValues":[0,1,5]             
}', null, 1, 0, 0, 0);
INSERT INTO pos.template_rule (code_template, name_template, before_wares_script, wares_calc_script, after_wares_script, param, code_event_list, sign_activity, version_row, type_template, use_template) VALUES (16, 'Свободная цена(установка новой цены)', 'import common.UserPos
import common.Wares
import common.WaresOrder
import common.SetRule

private boolean isEnableChangePrice(WaresOrder wo) {
    SetRule setRule = ruleLoyal.setRuleList
            .findAll{it.numberSet == 1}
            .find{(it.typeValue == 0 && it.codeValue == wo.codeWares) || 
                  (it.typeValue == 1 && it.codeValue in wo.waresExt.wares.codeGroupAll) ||
                  (it.typeValue == 5 && wo.waresExt.waresProperty.find {wp -> wp.codeProperty == it.codeValue})}
    SetRule setRuleExclude = ruleLoyal.setRuleList
            .findAll{it.numberSet == 2}
            .find{(it.typeValue == 0 && it.codeValue == wo.codeWares) || 
                  (it.typeValue == 1 && it.codeValue in wo.waresExt.wares.codeGroupAll) ||  
                  (it.typeValue == 5 && wo.waresExt.waresProperty.find {wp -> wp.codeProperty == it.codeValue})}
    return (setRule != null && setRuleExclude == null)
}

private void setPrice(WaresOrder wo, int codeEvent) {
    wo.interimData[ruleLoyal.codeRule] = [:]
    if (!isEnableChangePrice(wo)) {
        master.gui.showMessage(master.gui.waresCheckStage, "Для этой группы товаров ручная скидка запрещена")
        return
    }
    if (!wo.signNew) {
        master.gui.showMessage(master.gui.waresCheckStage, "Можно задавать свободную цену только для последнего товара")
        return
    }
    UserPos user = master.auth.checkAccess(master.gui.waresCheckStage, codeEvent);
    if (user == null) {
        master.gui.showMessage(master.gui.waresCheckStage, master.getResourceValue(master.langResource, ''notaccess'', "Нет доступа"))
        return;
    }

    def newPrice = -1.00
    String inputValue = master.gui.showInputNumber(master.gui.waresCheckStage, "Введите цену", null);
    if (inputValue == null || inputValue.length() == 0) return
    try {
        newPrice = master.roundBigDecimal(inputValue as BigDecimal, 2)
    } catch (ex) {
        master.log(ex)
    }

    if (newPrice < 0) {
        master.gui.showMessage("Внимание!", "Некорректное значение цены", "Ок")
        return
    }
    BigDecimal minPrice = wo.priceDealerObj.indicativeMinPrice == null ? 0.00 : master.roundBigDecimal(wo.priceDealerObj.indicativeMinPrice, 2);
    BigDecimal maxPrice = wo.priceDealerObj.indicativeMaxPrice == null ? 99999999 : master.roundBigDecimal(wo.priceDealerObj.indicativeMaxPrice, 2);

    if (wo.priceDealerObj.indicativeActive == 1 && (newPrice < minPrice || newPrice > maxPrice)) {
        String minPriceText = wo.priceDealerObj.indicativeMinPrice == null ? "не задано" : master.roundBigDecimal(wo.priceDealerObj.indicativeMinPrice, 2);
        String maxPriceText = wo.priceDealerObj.indicativeMaxPrice == null ? "не задано" : master.roundBigDecimal(wo.priceDealerObj.indicativeMaxPrice, 2);
        master.gui.showMessage(master.gui.waresCheckStage, "Заданная цена ${newPrice} выходит за границы индикатива: min = ${minPriceText}; max = ${maxPriceText}")
        return
    }
    wo.interimData[ruleLoyal.codeRule]["newPrice"] = newPrice
    def audit = master.createAudit();
    audit.codeEvent = codeEvent
    audit.codeWares = wo.codeWares
    audit.quantity = wo.quantity
    audit.codeUnit = wo.codeUnit
    audit.price = wo.price
    audit.codeUser = user.codeUser
    master.auth.insAudit(audit)
}

WaresOrder wo = values["waresOrder"]
Integer codeRule = values["codeRule"] as Integer
if (wo == null || codeRule == null || codeRule != ruleLoyal.codeRule) return
int codeEvent = check.orderClient.typeOrder == 0 ? 64 : 79
setPrice(wo, codeEvent)
', 'price = waresOrder.interimData.get(ruleLoyal.codeRule)?.get("newPrice") as BigDecimal
', null, '{
    "setRule" : {"1": {"name": "Товары для скидки"}, "2": {"name": "Товары-исключения"}},
    "setRuleColumns" : [
            { "id": "nameTypeValue","label": "Тип данных" },
            { "id": "codeValue","label": "Код" },
            { "id": "nameValue","label": "Наименование" }
            ],
    "setRuleTypeValues":[0,1,5]                             
}', null, 1, 0, 0, 0);
INSERT INTO pos.template_rule (code_template, name_template, before_wares_script, wares_calc_script, after_wares_script, param, code_event_list, sign_activity, version_row, type_template, use_template) VALUES (17, 'Запрет возврата товара ', 'import common.SetRule
import common.WaresOrder

WaresOrder waresOrder = values["waresOrder"]
if (!check.isFreeReturn() || waresOrder == null) return

SetRule setRule = ruleLoyal.setRuleList
        .findAll{it.numberSet == 1}
        .find{(it.typeValue == 0 && it.codeValue == waresOrder.codeWares) ||
                (it.typeValue == 1 && it.codeValue in waresOrder.waresExt.wares.codeGroupAll) ||
                (it.typeValue == 5 && waresOrder.waresExt.waresProperty.find {wp -> wp.codeProperty == it.codeValue})}
if (setRule != null) {
    check.waresOrderList.remove(waresOrder)
    master.gui.showMessage("Товар запрещен для возврата")
    return
}', 'import common.SetRule
SetRule setRule = ruleLoyal.setRuleList
        .findAll{it.numberSet == 1}
        .find{(it.typeValue == 0 && it.codeValue == waresOrder.codeWares) || 
              (it.typeValue == 1 && it.codeValue in waresOrder.waresExt.wares.codeGroupAll) ||
              (it.typeValue == 5 && waresOrder.waresExt.waresProperty.find {wp -> wp.codeProperty == it.codeValue})}
if (setRule != null) {
    waresOrder.enableReturn = false
}', null, '{
    "setRule" : {"1": {"name": "Товары для запрета"}},
    "setRuleColumns" : [
            { "id": "nameTypeValue","label": "Тип данных" },
            { "id": "codeValue","label": "Код" },
            { "id": "nameValue","label": "Наименование" }
            ] ,
    "setRuleTypeValues":[0,1,5]                         
}', null, 1, 0, 0, 0);
INSERT INTO pos.template_rule (code_template, name_template, before_wares_script, wares_calc_script, after_wares_script, param, code_event_list, sign_activity, version_row, type_template, use_template) VALUES (18, 'Причина возврата, акт возврата, основание возврата ', 'import common.Check
import common.Value
import org.json.simple.parser.JSONParser

String text = master.options.getString("RETURN_REASON_LIST", "[]")
JSONParser json = new JSONParser();
ArrayList<HashMap<String, Object>> reasonList = (json.parse(text) as ArrayList<HashMap<String, Object>>);
if (reasonList.size() == 0) return
ArrayList<Value> list = []
reasonList.each {
    list.add(new Value(it.codeReason.toString(), it.nameReason.toString()))
}
Value inputValue = null
while (inputValue == null) {
    inputValue = master.gui.showListValues(master.gui.payFormStage, "Выберите причину возврата", list);
}
check.orderClient.addInfo["codeReason"] = inputValue.value
check.orderClient.addInfo["nameReason"] = inputValue.nameValue


import common.PosScript
import org.json.simple.parser.JSONParser

String codeReason = check.orderClient.addInfo["codeReason"] as String;
Map reason = reasonList.find{it["codeReason"] as String == codeReason}
int codeScript = reason["codeScript"]
PosScript posScript = master.db.getPosScript(codeScript)
Map values = ["check": check ]
String textMessage = master.runScriptReturnValue(posScript.textScript ,values) as String

if (check.orderClient.sumOrder > #sumReturn) {
    check.messageSplitCheck[ruleLoyal.codeRule] = textMessage
}

if (check.orderClient.codeOrderRet <= 0) {
    String comment = ""
    while (comment == null || comment.size() < 5) {
        comment = master.gui.showInputText(master.gui.payFormStage, "Основание для возврата(не менее 5 символов)", comment);
    }
    check.orderClient.addInfo["comment"] = comment
}', null, null, '{
    "input" : [{"name": "sumReturn", "description": "Печатать, если сумма возврата более", "type": "number"}] ,        
    "codeEventList" : [58,59]
}', null, 1, 0, 0, 1);
INSERT INTO pos.template_rule (code_template, name_template, before_wares_script, wares_calc_script, after_wares_script, param, code_event_list, sign_activity, version_row, type_template, use_template) VALUES (19, 'День рождения', 'if (check.client == null || check.client.dateBirth == null) return ;
def dateBirth =  {it ->
    Calendar calBirth = Calendar.getInstance();
    calBirth.setTime(check.client.dateBirth)
    calBirth.set( Calendar.getInstance().get(Calendar.YEAR),calBirth.get(Calendar.MONTH),calBirth.get(Calendar.DAY_OF_MONTH),0,0,0)
    calBirth.set(Calendar.MILLISECOND, 0);
    calBirth.getTime() }();
def today  =   {it ->
    Calendar calNow =  Calendar.getInstance()
    calNow.set(calNow.get(Calendar.YEAR),calNow.get(Calendar.MONTH),calNow.get(Calendar.DAY_OF_MONTH),0,0,0)
    calNow.set(Calendar.MILLISECOND, 0);
    calNow.getTime() }();
if (!((dateBirth - today) <= #daysAfter && ( dateBirth - today) >= -#daysBefore)) return false;
', 'if (check.client == null || check.client.dateBirth == null) return ;
def dateBirth =  {it ->
    Calendar calBirth = Calendar.getInstance();
    calBirth.setTime(check.client.dateBirth)
    calBirth.set( Calendar.getInstance().get(Calendar.YEAR),calBirth.get(Calendar.MONTH),calBirth.get(Calendar.DAY_OF_MONTH),0,0,0)
    calBirth.set(Calendar.MILLISECOND, 0);
    calBirth.getTime() }();
def today  =   {it ->
    Calendar calNow =  Calendar.getInstance()
    calNow.set(calNow.get(Calendar.YEAR),calNow.get(Calendar.MONTH),calNow.get(Calendar.DAY_OF_MONTH),0,0,0)
    calNow.set(Calendar.MILLISECOND, 0);
    calNow.getTime() }();
if (!((dateBirth - today) <= #daysAfter && ( dateBirth - today) >= -#daysBefore)) return false;
', 'if (check.client == null || check.client.dateBirth == null) return ;
def dateBirth =  {it ->
    Calendar calBirth = Calendar.getInstance();
    calBirth.setTime(check.client.dateBirth)
    calBirth.set( Calendar.getInstance().get(Calendar.YEAR),calBirth.get(Calendar.MONTH),calBirth.get(Calendar.DAY_OF_MONTH),0,0,0)
    calBirth.set(Calendar.MILLISECOND, 0);
    calBirth.getTime() }();
def today  =   {it ->
    Calendar calNow =  Calendar.getInstance()
    calNow.set(calNow.get(Calendar.YEAR),calNow.get(Calendar.MONTH),calNow.get(Calendar.DAY_OF_MONTH),0,0,0)
    calNow.set(Calendar.MILLISECOND, 0);
    calNow.getTime() }();
if (!((dateBirth - today) <= #daysAfter && ( dateBirth - today) >= -#daysBefore)) return false;
', '{
  "input" : [{"name": "daysBefore", "description": "Дней до дня рождения", "type": "number"},
             {"name": "daysAfter", "description": "Дней после дня рождения", "type": "number"}],
  "disableDuplication": true           
}', null, 1, 0, 2, 0);
INSERT INTO pos.template_rule (code_template, name_template, before_wares_script, wares_calc_script, after_wares_script, param, code_event_list, sign_activity, version_row, type_template, use_template) VALUES (20, 'Состояние счета', 'if (!(check.getSumAccountForType(#typeAccount) #compare #sumAccount)) return', 'if (!(check.getSumAccountForType(#typeAccount) #compare #sumAccount)) return', 'if (!(check.getSumAccountForType(#typeAccount) #compare #sumAccount)) return', '{
    "input" : [
        {"name":"typeAccount","description":"Счет","type":"listFromDB","codeReport":158},
        {"name": "compare", "description": "", "type": "fixedList", "list":{">":">", "<":"<", "==":"=", "!=":"!=", ">=":">=", "<=":"<="}},
        {"name":"sumAccount", "description":"Значение", "type": "number"}
    ]
}', null, 1, 0, 2, 0);
INSERT INTO pos.template_rule (code_template, name_template, before_wares_script, wares_calc_script, after_wares_script, param, code_event_list, sign_activity, version_row, type_template, use_template) VALUES (21, 'Результат работы другой скидки', 'if (!(check.waresOrderList.findAll{it.discountList.containsKey(#codeRule)}
	.collect{it.discountList.values()}
	.sum(0.00, {it[''sumDiscount'']}) #compare #sumDiscount )) return
', 'if (!(check.waresOrderList.findAll{it.discountList.containsKey(#codeRule)}
	.collect{it.discountList.values()}
	.sum(0.00, {it[''sumDiscount'']}) #compare #sumDiscount )) return
', 'if (!(check.waresOrderList.findAll{it.discountList.containsKey(#codeRule)}
	.collect{it.discountList.values()}
	.sum(0.00, {it[''sumDiscount'']}) #compare #sumDiscount )) return
', '{
    "input" : [
        {"name":"codeRule","description":"Скидка","type":"listFromDB","codeReport":157},
        {"name": "compare", "description": "", "type": "fixedList", "list":{">":">", "<":"<", "==":"=", "!=":"!=", ">=":">=", "<=":"<="}},
        {"name":"sumDiscount", "description":"Значение", "type": "number"}
    ]
}', null, 1, 0, 2, 0);
INSERT INTO pos.template_rule (code_template, name_template, before_wares_script, wares_calc_script, after_wares_script, param, code_event_list, sign_activity, version_row, type_template, use_template) VALUES (22, 'Печать информации о счете', null, null, 'import common.Check

/*Check check*/
if (check.client == null || check.state < 2) return
int typeAccount1 = #typeAccount1
int typeAccount2 = #typeAccount2

BigDecimal sumBegin1 = check.getSumAccountForType(typeAccount1) ?: 0.00
BigDecimal sumAdd1 = check.addSumAccountList
        .findAll{a ->  (a.key ==~ /[0-9]+:[0-9]+:[0-9]+/) &&  ((a.key.split(":")[1] as int) == typeAccount1)}
        .values()
        .sum {c -> master.roundBigDecimal(c.sumCredit,2)} ?: 0.00
BigDecimal sumPay1 = check.orderPayList
        .findAll{it.codeTypeAccount == typeAccount1}
        .sum(0.00, {it.sumPay}) ?: 0.00
BigDecimal sumEnd1 = sumBegin1 + sumAdd1 - sumPay1

BigDecimal sumBegin2 = check.getSumAccountForType(typeAccount2) ?: 0.00
BigDecimal sumAdd2 = check.addSumAccountList
        .findAll{a ->  (a.key ==~ /[0-9]+:[0-9]+:[0-9]+/) &&  ((a.key.split(":")[1] as int) == typeAccount2)}
        .values()
        .sum {c -> master.roundBigDecimal(c.sumCredit,2)} ?: 0.00
BigDecimal sumPay2 = check.orderPayList
        .findAll{it.codeTypeAccount == typeAccount2}
        .sum(0.00, {it.sumPay}) ?: 0.00
BigDecimal sumEnd2 = sumBegin2 + sumAdd2 - sumPay2
String numberCard =  (check.client.barcode.find{b-> b.keyFind}?.barcode) ?: (check.client.barcode.find()?.barcode)
String barcode = "XXXXX" + numberCard?.substring(5,12)+"X"
String text = """#text"""
check.messageSaleCheck[ruleLoyal.codeRule] = text
', '{
  "input" : [
    {"name":"typeAccount1","description":"Счет 1","type":"listFromDB","codeReport":158},
    {"name":"typeAccount2","description":"Счет 2","type":"listFromDB","codeReport":158},
    {"name": "text", "description": "Текст сообщения",
      "type": "string", "rows" : 10, "detail":"Можно использовать:\n${sumBegin1} - сч1. на начало ; ${sumAdd1} - сч1. начислено ;\n ${sumPay1} - сч1. потрачено ; ${sumEnd1} - сч1. на конец.    Для счета 2 - аналогично. ${barcode} - карта клиента" }
  ],
  "disableDuplication": true
}
', null, 1, 0, 1, 0);
INSERT INTO pos.template_rule (code_template, name_template, before_wares_script, wares_calc_script, after_wares_script, param, code_event_list, sign_activity, version_row, type_template, use_template) VALUES (23, 'Мелочь от сдачи на счет клиенту', 'import common.Check
import common.CreditAccount
import common.WaresOrder

assert check instanceof Check
if (check.state <= 1 || check.client == null ) return
BigDecimal sumOdd = check.sumOdd
BigDecimal sumSmallChange = sumOdd - (sumOdd as int)
if (sumSmallChange <= 0 || master.gui.showConfirm("Положить $sumSmallChange на счет клиенту?") != 1) return

check.enableLoyal = false
String keyPay = ''enableEditCheckWithPay''
check.interimData[keyPay] = true
WaresOrder wo = master.findWares("#codeWares" , 1, [:] , 1, sumSmallChange)
wo.enableLoyal = false
check.interimData.remove(keyPay)
check.enableLoyal = true

int codeClient = check.client.codeClient
int codeTypeAccount = #codeTypeAccount
Integer codeRule =  ruleLoyal.codeRule
String key = "$codeRule:${codeTypeAccount}:${codeClient}"
wo.creditInfo[key]  = [codeRule: codeRule, codeTypeAccount: codeTypeAccount, sumCredit: sumSmallChange, codeClient: codeClient]
if (check.addSumAccountList[key]  != null) check.addSumAccountList[key].sumCredit += sumSmallChange
else check.addSumAccountList[key] = new CreditAccount(codeRule: codeRule,
        codeTypeAccount: codeTypeAccount,
        sumCredit: sumSmallChange,
        delayCredit : 0,
        online: true,
        codeClient: codeClient)', null, null, '{
    "input" : [ 
        {"name":"codeTypeAccount","description":"Счет","type":"listFromDB","codeReport":158},
        {"name":"codeWares","description":"Код товара","type":"number"}   
        ],
    "codeEventList" : [58] 
}', null, 1, 0, 0, 0);
INSERT INTO pos.template_rule (code_template, name_template, before_wares_script, wares_calc_script, after_wares_script, param, code_event_list, sign_activity, version_row, type_template, use_template) VALUES (24, 'Отмена ручных скидок', 'common.WaresOrder wo = values["waresOrder"]
Integer codeRule = values["codeRule"] as Integer
if (wo == null || codeRule == null || codeRule != ruleLoyal.codeRule) return
check.manualRuleList.each{ wo.interimData[it] = [:] }

', null, null, null, null, 1, 0, 0, 0);
INSERT INTO pos.template_rule (code_template, name_template, before_wares_script, wares_calc_script, after_wares_script, param, code_event_list, sign_activity, version_row, type_template, use_template) VALUES (25, 'Свободная сумма скидки ', 'import common.UserPos
import common.Wares
import common.WaresOrder
import common.SetRule

private boolean isEnableChangePrice(WaresOrder wo) {
    SetRule setRule = ruleLoyal.setRuleList
            .findAll{it.numberSet == 1}
            .find{(it.typeValue == 0 && it.codeValue == wo.codeWares) || 
                  (it.typeValue == 1 && it.codeValue in wo.waresExt.wares.codeGroupAll) ||
                  (it.typeValue == 5 && wo.waresExt.waresProperty.find {wp -> wp.codeProperty == it.codeValue})}
    SetRule setRuleExclude = ruleLoyal.setRuleList
            .findAll{it.numberSet == 2}
            .find{(it.typeValue == 0 && it.codeValue == wo.codeWares) || 
                  (it.typeValue == 1 && it.codeValue in wo.waresExt.wares.codeGroupAll) ||
                  (it.typeValue == 5 && wo.waresExt.waresProperty.find {wp -> wp.codeProperty == it.codeValue})}
    return (setRule != null && setRuleExclude == null)
}
private void setPrice(WaresOrder wo, int codeEvent) {

    if (!isEnableChangePrice(wo)) {
        master.gui.showMessage(master.gui.waresCheckStage, "Для этой группы товаров ручная скидка запрещена")
        return
    }
    if (!wo.signNew) {
        master.gui.showMessage(master.gui.waresCheckStage, "Можно задавать свободную цену только для последнего товара")
        return
    }
    UserPos user = master.auth.checkAccess(master.gui.waresCheckStage, codeEvent);
    if (user == null) {
        master.gui.showMessage(master.gui.waresCheckStage, master.getResourceValue(master.langResource, ''notaccess'', "Нет доступа"))
        return;
    }

    def sumDiscount = -1.00
    String inputValue = master.gui.showInputNumber(master.gui.waresCheckStage, "Введите скидку", null);
    if (inputValue == null || inputValue.length() == 0) return
    try {
        sumDiscount = master.roundBigDecimal(inputValue as BigDecimal, 2)
    } catch (ex) {
        master.log(ex)
    }

    BigDecimal minPrice = wo.priceDealerObj.indicativeMinPrice == null ? 0.00 : master.roundBigDecimal(wo.priceDealerObj.indicativeMinPrice, 2);
    BigDecimal maxPrice = wo.priceDealerObj.indicativeMaxPrice == null ? 99999999 : master.roundBigDecimal(wo.priceDealerObj.indicativeMaxPrice, 2);

    BigDecimal newPrice = wo.priceDealerObj.priceDealer - master.roundBigDecimal(sumDiscount/wo.quantity, 2);
    if (wo.priceDealerObj.indicativeActive == 1 && (newPrice < minPrice || newPrice > maxPrice)) {
        if (master.auth.checkAccess(master.gui.waresCheckStage, 83) == null) {
            master.gui.showMessage(master.gui.waresCheckStage, master.getResourceValue(master.langResource, ''notaccess'', "Нет доступа"))
            return;
        }
/*
        String minPriceText = wo.priceDealerObj.indicativeMinPrice == null ? "не задано" : master.roundBigDecimal(wo.priceDealerObj.indicativeMinPrice, 2);
        String maxPriceText = wo.priceDealerObj.indicativeMaxPrice == null ? "не задано" : master.roundBigDecimal(wo.priceDealerObj.indicativeMaxPrice, 2);
        master.gui.showMessage(master.gui.waresCheckStage, "Заданная цена ${sumDiscount} выходит за границы индикатива: min = ${minPriceText}; max = ${maxPriceText}")
        return
*/
    }
    wo.interimData[ruleLoyal.codeRule] = [:]
    wo.interimData[ruleLoyal.codeRule]["sumDiscount"] = sumDiscount
    def audit = master.createAudit();
    audit.codeEvent = codeEvent
    audit.codeWares = wo.codeWares
    audit.quantity = wo.quantity
    audit.codeUnit = wo.codeUnit
    audit.price = wo.price
    audit.codeUser = user.codeUser
    master.auth.insAudit(audit)
}

WaresOrder wo = values["waresOrder"]
Integer codeRule = values["codeRule"] as Integer
if (wo == null || codeRule == null || codeRule != ruleLoyal.codeRule) return
int codeEvent = check.orderClient.typeOrder == 0 ? 65 : 80
setPrice(wo,codeEvent)
', 'sumDiscount = waresOrder.interimData.get(ruleLoyal.codeRule)?.get("sumDiscount") as BigDecimal
', null, '{
    "input":[],
    "setRule" : {"1": {"name": "Товары для скидки"}, "2": {"name": "Товары-исключения"}},
    "setRuleColumns" : [
            { "id": "nameTypeValue","label": "Тип данных" },
            { "id": "codeValue","label": "Код" },
            { "id": "nameValue","label": "Наименование" }
            ],
    "setRuleTypeValues":[0,1,5]                             
}', null, 1, 0, 0, 0);
INSERT INTO pos.template_rule (code_template, name_template, before_wares_script, wares_calc_script, after_wares_script, param, code_event_list, sign_activity, version_row, type_template, use_template) VALUES (26, 'Начисление бонусов в свободных возвратах', 'import common.Check
import common.CreditAccount
import common.WaresOrder

WaresOrder waresOrder = (check as Check).waresOrderList.findAll {!it.deleted}.min{it.num}
Integer codeRule = values["codeRule"] as Integer
if (waresOrder == null || codeRule == null || codeRule != ruleLoyal.codeRule) return

if (master.auth.checkAccess(master.gui.waresCheckStage, 84) == null) {
    master.gui.showMessage(master.gui.waresCheckStage, master.getResourceValue(master.langResource, ''notaccess'', "Нет доступа"))
    return;
}
if (check.client == null ) {
    master.gui.showMessage(master.gui.waresCheckStage, "Не задан клиент")
    return
}
BigDecimal sumCredit = master.gui.showInputNumber(master.gui.waresCheckStage, "Введите сумму начислений бонусов", null);
if (sumCredit == null) return
waresOrder.interimData["${ruleLoyal.codeRule}-sumCredit"] = sumCredit', 'import common.Check
import common.CreditAccount
import common.WaresOrder

BigDecimal sumCredit = waresOrder.interimData["${ruleLoyal.codeRule}-sumCredit"] as BigDecimal
if (sumCredit == null) return
int codeClient = check.client.codeClient
int codeTypeAccount = 1
Integer codeRule =  ruleLoyal.codeRule
def key = "$codeRule:${codeTypeAccount}:${codeClient}"
waresOrder.creditInfo[key]  = [codeRule: codeRule, codeTypeAccount: codeTypeAccount, sumCredit: sumCredit, codeClient: codeClient]
check.addSumAccountList[key] = new CreditAccount(codeRule: ruleLoyal.codeRule,
        codeTypeAccount: codeTypeAccount,
        sumCredit: sumCredit,
        delayCredit : 0,
        online: false,
        codeClient: codeClient)', null, null, null, 1, 0, 0, 0);
INSERT INTO pos.template_rule (code_template, name_template, before_wares_script, wares_calc_script, after_wares_script, param, code_event_list, sign_activity, version_row, type_template, use_template) VALUES (27, 'Запрет списаний и начислений ', 'import common.Check

//Check check
String text = "#minPriceOrder"
int typeAccount = #typeAccount
try {
    check.orderClient.minSumPayReal = new BigDecimal(text)
} catch(ex) {}


ruleLoyal.setRuleList
        .findAll{it.numberSet == 1}
        .each { set ->
            check.waresOrderList.findAll{ wo ->
                (set.typeValue == 0 && set.codeValue == wo.codeWares) || 
                (set.typeValue == 1 && set.codeValue in wo.waresExt.wares.codeGroupAll) ||
                (set.typeValue == 5 && wo.waresExt.waresProperty.find {wp -> wp.codeProperty == set.codeValue})
            }.each {wo -> wo.minSumPayReal = 10000000.00}
        }

ruleLoyal.setRuleList
        .findAll{it.numberSet == 2}
        .each { set ->
            check.waresOrderList.findAll{ wo ->
                (set.typeValue == 0 && set.codeValue == wo.codeWares) || 
                (set.typeValue == 1 && set.codeValue in wo.waresExt.wares.codeGroupAll) ||
                (set.typeValue == 5 && wo.waresExt.waresProperty.find {wp -> wp.codeProperty == set.codeValue})                        
            }.each { wo ->
                if (wo.interimData["disableCreditAccount"] == null) wo.interimData["disableCreditAccount"] = [:]
                wo.interimData["disableCreditAccount"][typeAccount] = true
            }
        } 
', 'import common.WaresOrder

/*
WaresOrder waresOrder
*/
if (#considerIndicativeMinPrice) {
   BigDecimal minPrice =  ((waresOrder.priceDealerObj.indicativeActive==1) ? (waresOrder.priceDealerObj.indicativeMinPrice ?:0.00) : 0.00) * waresOrder.quantity
   waresOrder.minSumPayReal = [minPrice, waresOrder.minSumPayReal].max()
}', null, '{
  "input":[
    {"name": "considerIndicativeMinPrice", "description": "Для всех товаров запретить списание ниже минимальной цены индикатива", "type": "boolean", "defaultValue":true},
    {"name": "minPriceOrder", "description": "Минимальная сумма чека, оплаченная средствами клиента", "type": "number", "defaultValue": 0.1},
    {"name":"typeAccount","description":"Счет","type":"listFromDB","codeReport":158}
  ],
  "setRule" : {"1": {"name": "Запрет списаний"}, "2": {"name": "Запрет начислений"}},
  "setRuleColumns" : [
    { "id": "nameTypeValue","label": "Тип данных" },
    { "id": "codeValue","label": "Код" },
    { "id": "nameValue","label": "Наименование" }
  ] ,
  "setRuleTypeValues":[0,1,5]
}', null, 1, 0, 0, 0);
INSERT INTO pos.template_rule (code_template, name_template, before_wares_script, wares_calc_script, after_wares_script, param, code_event_list, sign_activity, version_row, type_template, use_template) VALUES (28, 'Скидка с управлением индикативом', null, '//waresOrder.loyalInfo[ruleLoyal.codeRule]=["codeRule":ruleLoyal.codeRule]
if (sumDiscount != null) {
    BigDecimal correctedSum = (#checkIndicative ? loyal.correctSumDiscountByIndicative(waresOrder, sumDiscount) : sumDiscount)
    loyal.setDiscount(check, ruleLoyal, waresOrder, correctedSum)
} else if (price != null) {
    BigDecimal correctedPrice = #checkIndicative ? loyal.correctPriceByIndicative(waresOrder, price) : price
    loyal.setPrice(check, ruleLoyal, waresOrder, correctedPrice)
}', null, '{
  "input": [
    {
      "name": "checkIndicative",
      "description": "Учитывать индикатив",
      "type": "boolean",
      "defaultValue": true
    }
  ],
  "disableDuplication": true
}', null, 1, 0, 1, 1);
INSERT INTO pos.template_rule (code_template, name_template, before_wares_script, wares_calc_script, after_wares_script, param, code_event_list, sign_activity, version_row, type_template, use_template) VALUES (29, 'Запрет продажи товара', 'import common.Check
import common.Notification
import common.RuleLoyal
import common.SetRule
import common.WaresOrder
import groovy.transform.Field

String getTimeString(String begin, String end) {
    return "${begin ?: "00:00"}-${end ?: "23:59"}"
}
String key = "${ruleLoyal.codeRule}"
master.gui.removeNotif(key);

check.waresOrderList.each { wo ->
    SetRule rangeSetRule = ruleLoyal.setRuleList.find {
        it.numberSet == 1 && master.db.checkTimeActivity(getTimeString(it.s1, it.s2));
    }
    includeCondition = (ruleLoyal.setRuleList.findAll { it.numberSet == 2 }.size() == 0 ||
            ruleLoyal.setRuleList
                    .findAll { it.numberSet == 2 }
                    .find {
                        (it.typeValue == 0 && it.codeValue == wo.codeWares) ||
                                (it.typeValue == 1 && it.codeValue in wo.waresExt.wares.codeGroupAll) ||
                                (it.typeValue == 5 && wo.waresExt.waresProperty.find { wp -> wp.codeProperty == it.codeValue })
                    } != null)
    excludeCondition = (ruleLoyal.setRuleList
            .findAll { it.numberSet == 3 }
            .find {
                (it.typeValue == 0 && it.codeValue == wo.codeWares) ||
                        (it.typeValue == 1 && it.codeValue in wo.waresExt.wares.codeGroupAll) ||
                        (it.typeValue == 5 && wo.waresExt.waresProperty.find { wp -> wp.codeProperty == it.codeValue })
            } == null)

    if (rangeSetRule != null && includeCondition && excludeCondition) {
        String nameWares = wo.nameWares
        String text = "#text"
        Notification notif = new Notification();
        notif.setText(text);
        notif.setDisablePay(true);
        notif.setDisablePrintCheck(true);
        master.gui.addNotif(key, notif);
    }
}

', null, null, '{
    "input" : [
        {"name": "text", "description": "Текст, поясняющий запрет",  "type": "string", "rows" : 3, "detail":"Можно использовать: ${nameWares} - наименование товара" }
        ] ,
    "setRule" : {
      "1": {"name": "Диапазоны",  "setRuleColumns" : [
            { "id": "nameTypeValue","label": "Тип данных" },
            { "id": "s1","label": "Начальное время", "type": "time" },
            { "id": "s2","label": "Конечное время", "type": "time" }
            ],
          "setRuleTypeValues":[6]
      },
      "2": {"name": "Товары для скидки","setRuleTypeValues":[0,1,5]},
      "3": {"name": "Товары-исключения","setRuleTypeValues":[0,1,5]}
    },
  "setRuleColumns" : [
            { "id": "nameTypeValue","label": "Тип данных" },
            { "id": "codeValue","label": "Код" },
            { "id": "nameValue","label": "Наименование" }
            ]
}', null, 1, 0, 0, 0);
INSERT INTO pos.template_rule (code_template, name_template, before_wares_script, wares_calc_script, after_wares_script, param, code_event_list, sign_activity, version_row, type_template, use_template) VALUES (30, 'Проверка возраста', 'import common.Check
import common.Notification
import common.RuleLoyal
import common.SetRule
import common.WaresOrder
import groovy.transform.Field

String key = "${ruleLoyal.codeRule}"
master.gui.removeNotif(key);
if (check.ageVerified) return

boolean includeCondition(WaresOrder wo) {
    return ruleLoyal.setRuleList
        .findAll { it.numberSet == 1 }
        .find {
            (it.typeValue == 0 && it.codeValue == wo.codeWares) ||
            (it.typeValue == 1 && it.codeValue in wo.waresExt.wares.codeGroupAll) ||
            (it.typeValue == 5 && wo.waresExt.waresProperty.find { wp -> wp.codeProperty == it.codeValue })
        } != null
}
boolean excludeCondition(WaresOrder wo) {
    return ruleLoyal.setRuleList
        .findAll { it.numberSet == 2 }
        .find {
            (it.typeValue == 0 && it.codeValue == wo.codeWares) ||
            (it.typeValue == 1 && it.codeValue in wo.waresExt.wares.codeGroupAll) ||
            (it.typeValue == 5 && wo.waresExt.waresProperty.find { wp -> wp.codeProperty == it.codeValue })
        } == null
}
WaresOrder wo = values["waresOrder"] as WaresOrder

if (wo != null && includeCondition(wo) && excludeCondition(wo)) {
    String nameWares = wo.nameWares
    String text = "#text"
    if (master.gui.showConfirm(text, "Так", "Hi") == 1) {
        check.ageVerified = true
        return
    } else {
        check.waresOrderList.remove(wo)
    }
}
', null, null, '{
    "input" : [
        {"name": "text", "description": "Текст, поясняющий запрет",  "type": "string", "rows" : 3, "detail":"Можно использовать: ${nameWares} - наименование товара" }
        ] ,
    "setRule" : {
      "1": {"name": "Товары для запрета","setRuleTypeValues":[0,1,5]},
      "2": {"name": "Товары-исключения","setRuleTypeValues":[0,1,5]}
    },
  "setRuleColumns" : [
            { "id": "nameTypeValue","label": "Тип данных" },
            { "id": "codeValue","label": "Код" },
            { "id": "nameValue","label": "Наименование" }
            ]
}', null, 1, 0, 0, 0);
INSERT INTO pos.template_rule (code_template, name_template, before_wares_script, wares_calc_script, after_wares_script, param, code_event_list, sign_activity, version_row, type_template, use_template) VALUES (31, 'Результат начисления другого правила', 'if (!{it->
    String key = "${#codeRule}:${#typeAccount}:${check.client?.codeClient}"
    return ((check.addSumAccountList[key]?:0.00) #compare #sumCredit)}()) return 
', 'if (!{it->
    String key = "${#codeRule}:${#typeAccount}:${check.client?.codeClient}"
    return ((check.addSumAccountList[key]?:0.00) #compare #sumCredit)}()) return ', 'if (!{it->
    String key = "${#codeRule}:${#typeAccount}:${check.client?.codeClient}"
    return ((check.addSumAccountList[key]?:0.00) #compare #sumCredit)}()) return ', '{
    "input" : [
      {"name":"typeAccount","description":"Счет","type":"listFromDB","codeReport":158},
      {"name":"codeRule","description":"Начислено по правилу","type":"listFromDB","codeReport":160},
      {"name": "compare", "description": "", "type": "fixedList", "list":{">":">", "<":"<", "==":"=", "!=":"!=", ">=":">=", "<=":"<="}},
      {"name":"sumCredit", "description":"Значение", "type": "number"}
    ]
}', null, 1, 0, 2, 0);