import React, {useEffect, useState} from "react";
import * as yup from "yup";
import {PriceType} from "../../../model/interfaces";
import {useFormik} from "formik";
import axios from "axios";
import MessageDialog from "../../message-dialog/MessageDialog";
import styles from "./style.module.scss";
import {TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Confirm from "../../../confirm/Confirm";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Loader from "../../loader/Loader";

type EditPriceTypeProps = {
    show: boolean,
    setShow: (show: boolean) => void
    refresh: () => void
    priceType: PriceType | null
    priceTypeList: Array<PriceType>
}

const EditPriceType: React.FC<EditPriceTypeProps> = (props: EditPriceTypeProps) => {
    const [errorText, setErrorText] = useState<string|null>(null)
    const [loading, setLoading] = useState(false)
    const [textMessage, setTextMessage] = useState<String>('')
    const [showMessage, setShowMessage] = useState(false)
    const [showConfirmDelete, setShowConfirmDelete] = useState(false)

    const validationSchema = yup.object({
        abrType: yup
            .string()
            .required('Введите обозначение типа'),
        nameType: yup
            .string()
            .required('Введите наименование'),
        priority: yup
            .number()
            .required('Введите приоритет')
    });

    const getVoidPriceType = (): PriceType => {
        return {abrType: '', nameType: '', priority: 1}
    }
    const priceType: PriceType = props.priceType || getVoidPriceType()

    const formik = useFormik({
        initialValues: priceType,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            save(values)
        },
    });

    useEffect(() => {
    }, [])

    const deleteItem = async () => {
        const option: any = {
            url: '/api-option/delete-price-type',
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json;charset=UTF-8'
            },
            data: priceType
        }
        setLoading(true)
        await axios(option)
            .then(() => {
                props.refresh()
                hide()
            })
            .catch(error => showTextMessage(`Ошибка удаления. ${error.response.data}`))
            .finally(() => setLoading(false))
    }

    const message = (): JSX.Element => {
        return <MessageDialog
            setShow={setShowMessage}
            show={showMessage}
            text={textMessage}
        />
    }

    const abrTypeField = () => {
        const nameField = 'abrType'
        return (
            < TextField
                size = {"small"}
                className = {styles.inputParamField}
                variant = "outlined"
                id = {nameField}
                name = {nameField}
                type = {"text"}
                value = {formik.values[nameField]}
                onChange = {formik.handleChange}
                error = {formik.touched[nameField] && Boolean(formik.errors[nameField])}
                helperText = {formik.touched[nameField] && formik.errors[nameField]}
                disabled = {props.priceType != null}
            />
        )
    }

    const priorityField = () => {
        const nameField = 'priority'
        return (
            < TextField
                size = {"small"}
                className = {styles.inputParamField}
                variant = "outlined"
                id = {nameField}
                name = {nameField}
                type = {"number"}
                value = {formik.values[nameField]}
                onChange = {formik.handleChange}
                error = {formik.touched[nameField] && Boolean(formik.errors[nameField])}
                helperText = {formik.touched[nameField] && formik.errors[nameField]}
            />
        )
    }

    const nameTypeField = () => {
        const nameField = 'nameType'
        return (
            < TextField
                size = {"small"}
                className = {styles.inputParamField}
                variant = "outlined"
                id = {nameField}
                name = {nameField}
                type = {"text"}
                value = {formik.values[nameField]}
                onChange = {formik.handleChange}
                error = {formik.touched[nameField] && Boolean(formik.errors[nameField])}
                helperText = {formik.touched[nameField] && formik.errors[nameField]}
            />
        )
    }

    const form = ():JSX.Element => (
        <form onSubmit={formik.handleSubmit} autoComplete="off">
            <div className={styles.formInput} >
                <div className={styles.label}>Обозначение типа:</div>
                {abrTypeField()}

                <div className={styles.label}>Наименование:</div>
                {nameTypeField()}

                <div className={styles.label}>Приоритет:</div>
                {priorityField()}
            </div>
            <div className={styles.buttonPanel}>
                {props.priceType != null && <Button variant="contained" onClick={() => setShowConfirmDelete(true)} color="primary"> Удалить </Button>}
                <Button variant="contained" onClick={hide} color="primary"> Отменить </Button>
                <Button variant="contained" color="primary" type={"submit"}> Ввод </Button>
            </div>
        </form>
)

    const hide = () => {
        props.setShow(false)
    }

    const showTextMessage = (text: String) => {
        setTextMessage(text)
        setShowMessage(true)
    }

    const save = (values: PriceType) => {
        const option: any = {
            url: '/api-option/save-price_type',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            data: values
        }
        setLoading(true)
        axios(option)
            .then((r: any) => {
                props.refresh()
                hide()
            })
            .catch(error => showTextMessage('Ошибка сохранения. '+ error.response.data))
            .finally(() => setLoading(false))
    }

    const confirmDeleteForm = (): JSX.Element => {
        return <Confirm
            text={"Удалить выбранный тип плановой цены?"}
            func={deleteItem}
            show={showConfirmDelete}
            setShow={setShowConfirmDelete}
        />
    }

    const headerText = () => {
        if (props.priceType) {
            return `Редактирование типа плановой цены ${priceType.abrType}`
        } else return "Создание типа плановой цены"
    }

    return (<Dialog
        open={props.show}
        onClose={() => props.setShow(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth={'sm'}
        className={styles.dialog}
    >
        <DialogTitle id="alert-dialog-title">
          <div className={styles.header}>{headerText()}</div>
        </DialogTitle>
        <DialogContent>
            {loading ? <Loader/> : (errorText || form())}
            {showMessage && message()}
            {showConfirmDelete && confirmDeleteForm()}
        </DialogContent>
    </Dialog>
    )
}

export default EditPriceType