import React, {useEffect, useState} from "react";
import {PriceType, Profile} from "../../../model/interfaces";
import axios from "axios";
import EnhancedTable from "../../enhanced-table/EnhancedTable";
import styles from "./style.module.scss";
import Button from "@material-ui/core/Button";
import Loader from "../../loader/Loader";
import EditPriceType from "../edit";

type PriceTypeListProps = {

}

const PriceTypeList: React.FC<PriceTypeListProps> = (props: PriceTypeListProps) => {
    const [itemList, setItemList] = useState<Array<PriceType>|null>(null)
    const [errorText, setErrorText] = useState<string>()
    const [loading, setLoading] = useState(false)
    const [showEdit, setShowEdit] = useState(false)
    const [dateRefresh, setDateRefresh] = useState<Date>(new Date)
    const [selected, setSelected] = useState<Array<number>>([])
    const [currentItem, setCurrentItem] = useState<PriceType|null>(null)
    const [showEditAccess, setShowEditAccess] = useState(false)

    const refreshItemList = () => {
        setLoading(true)
        axios.get(`api-option/all-price_type`)
            .then(response => {
                setItemList(response.data)
            })
            .catch(error => {})
            .finally(() => {setLoading(false)})
    }

    useEffect(() => {
        refreshItemList()
    },[dateRefresh])

    const editItem = (item: PriceType) => {
        setCurrentItem(item)
        setShowEdit(true)
    }

    const editAccessEvent = (item: PriceType) => {
        setCurrentItem(item)
        setShowEditAccess(true)
    }

    const table = (): JSX.Element => {
        const header = [
            { id: 'abrType',label: 'Обозначение типа'  },
            { id: 'nameType',label: 'Наименование'  },
            { id: 'priority',label: 'Приоритет' }
        ];

        return <div className={"loyal-list-form"}>
            <EnhancedTable
                header={header}
                rows={itemList}
                idColumn={"abrType"}
                title={""}
                selected={selected}
                setSelected={setSelected}
                enableCheckBox={false}
                onClick={editAccessEvent}
                onEdit={editItem as any}
                maxHeight={650}
                initRowsPerPage={15}
                tableName={"priceTypes"}
                enableEdit={true}
            />
        </div>
    }

    const add = () => {
        setCurrentItem(null)
        setShowEdit(true)
    }

    const buttonPanel = ():JSX.Element => {
        return <div className={styles.topButtonPanel}>
            <Button
                size={"small"}
                fullWidth={false}
                variant="contained"
                onClick={add}
                color="primary"
                className={"button-add-save"}> Создать
            </Button>
        </div>
    }

    const refresh = () => {
        setDateRefresh(new Date())
    }

    const editItemForm = ():JSX.Element => {
        return (<EditPriceType
            show={showEdit}
            setShow={setShowEdit}
            refresh={refresh}
            priceType={currentItem}
            priceTypeList={itemList!!}
        />)
    }

    return (<div className={styles.content}>
        <h3 className={styles.header}>Статус роботи кас</h3>
        {buttonPanel()}
        {loading ? <Loader/> : itemList != null && table()}
        {showEdit && editItemForm() }
    </div>)
}

export default PriceTypeList