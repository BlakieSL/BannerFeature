import React, {useEffect, useState} from "react";
import * as yup from "yup";
import {WorkplaceStatus} from "../../../model/interfaces";
import {useFormik} from "formik";
import axios from "axios";
import MessageDialog from "../../message-dialog/MessageDialog";
import styles from "./style.module.scss";
import {Select, TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Confirm from "../../../confirm/Confirm";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Loader from "../../loader/Loader";
import Checkbox from "@material-ui/core/Checkbox";

type EditWorkplaceStatusProps = {
    show: boolean
    setShow: (show: boolean) => void
    refresh: () => void
    workplaceStatus: WorkplaceStatus | null
    workplaceStatusList: Array<WorkplaceStatus>
    checkIdWorkplace: boolean
    setCheckIdWorkplace: (checkIdWorkplace: boolean) => void
    idWorkplace: number
    setIdWorkplace: (idWorkplace: number) => void
    checkCodeShop: boolean
    setCheckCodeShop: (checkCodeShop: boolean) => void
    codeShop: number
    setCodeShop: (codeShop: number) => void
    ignoreInterval: number
    setIgnoreInterval: (ignoreInterval: number) => void
    problemInterval: number
    setProblemInterval: (setProblemInterval: number) => void
    checkProblem: boolean
    setCheckProblem: (checkProblem: boolean) => void
}

const EditWorkplaceStatus: React.FC<EditWorkplaceStatusProps> = (props: EditWorkplaceStatusProps) => {
    const [errorText, setErrorText] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [textMessage, setTextMessage] = useState<String>('')
    const [showMessage, setShowMessage] = useState(false)
    const [showConfirmDelete, setShowConfirmDelete] = useState(false)
    const [checkIdWorkplace, setCheckIdWorkplace] = useState(props.checkIdWorkplace)
    const [idWorkplace, setIdWorkplace] = useState(props.idWorkplace)
    const [checkCodeShop, setCheckCodeShop] = useState(props.checkCodeShop)
    const [codeShop, setCodeShop] = useState(props.codeShop)
    const [ignoreInterval, setIgnoreInterval] = useState(props.ignoreInterval)
    const [problemInterval, setProblemInterval] = useState(props.problemInterval)
    const [checkProblem, setCheckProblem] = useState(props.checkProblem)


    const validationSchema = yup.object({
        codeShop: yup
            .number()
            .required('Введите обозначение типа'),
        idWorkplace: yup
            .number()
            .required('Введите наименование'),
        problem: yup
            .string()
            .required('Введите приоритет')
    });

    const getVoidWorkplaceStatus = (): WorkplaceStatus => {
        return {
            codeShop: -1,
            idWorkplace: -1,
            status:'',
            problem: '',
            replicationBegin: '',
            replicationEnd: '',
            successfulUpdate: '',
            successfulSend: '',
            lastTimeError: '',
            errorMessage: ''
        }
    }
    const workplaceStatus: WorkplaceStatus = props.workplaceStatus || getVoidWorkplaceStatus()

    const formik = useFormik({
        initialValues: workplaceStatus,
        validationSchema: validationSchema,
        onSubmit: () => {
            save()
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
            data: workplaceStatus
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

    const codeShopField = () => {
        const nameField = 'codeShop'
        const uniqueCodes = Array.from(new Set(props.workplaceStatusList.map(value => value.codeShop)));
        return (
            <Select defaultValue={uniqueCodes.map(value => `value${value}`)[0]}>
                {uniqueCodes.map(value => <option value={`value${value}`}>{value}</option>)}
            </Select>
        )
    }


    const idWorkplaceField = () => {
        const nameField = 'idWorkplace'
        const uniqueCodes = Array.from(new Set(props.workplaceStatusList.map(value => value.idWorkplace)));
        return (
            <Select defaultValue={uniqueCodes.map(value => `value${value}`)[0]}>
                {uniqueCodes.map(value => <option value={`value${value}`}>{value}</option>)}
            </Select>
        )
    }


    const form = (): JSX.Element => {
        return (
            <form onSubmit={formik.handleSubmit} autoComplete="off">
                <div className={styles.formInput} >

                    <div className={styles.label}>Код магазину:</div>
                    <Checkbox
                        color={"primary"}
                        defaultChecked={props.checkCodeShop}
                        onChange={e => {
                            setCheckCodeShop(e.target.checked)
                        }}
                    />
                    <input
                        disabled={!checkCodeShop}
                        type="number"
                        defaultValue={props.codeShop}
                        onChange={e => {
                            setCodeShop(e.target.value !== '' ? parseInt(e.target.value) : -1)
                        }}
                    />


                    <div className={styles.label}>Код каси:</div>
                    <Checkbox
                        color={"primary"}
                        defaultChecked={props.checkIdWorkplace}
                        onChange={e => {
                            setCheckIdWorkplace(e.target.checked)
                        }}
                    />
                    <input
                        disabled={!checkIdWorkplace}
                        type="number"
                        defaultValue={props.idWorkplace}
                        onChange={e => {
                            setIdWorkplace(e.target.value !== '' ? parseInt(e.target.value) : -1)
                        }}
                    />


                    <div className={styles.label}>Тільки проблемні каси:</div>
                    <Checkbox
                        color={"primary"}
                        defaultChecked={props.checkProblem}
                        onChange={e => {
                            setCheckProblem(e.target.checked)
                        }}
                    />
                    <div
                    > </div>


                    <div className={styles.label}>Вважати за помилку інтервал:</div>
                    <div className={styles.header}>[Хвилини]</div>
                    <input
                        type="number"
                        defaultValue={props.problemInterval}
                        onChange={e => {
                            setProblemInterval(e.target.value !== '' ? parseInt(e.target.value) : 5)
                        }}
                    />


                    <div className={styles.label}>Ігнорувати інтервал:</div>
                    <div className={styles.header}>[Дні]</div>
                    <input

                        type="number"
                        defaultValue={props.ignoreInterval}
                        onChange={e => {
                            setIgnoreInterval(e.target.value !== '' ? parseInt(e.target.value) : 360)
                        }}
                    />
                </div>
                <div className={styles.buttonPanel}>
                    {props.workplaceStatus != null &&
                        <Button variant="contained" onClick={() => setShowConfirmDelete(true)}
                                color="primary"> Видалити </Button>}
                    <Button variant="contained" onClick={hide} color="primary"> Відміна </Button>
                    <Button variant="contained" color="primary" type={"submit"} onClick={e => {
                        save()
                        props.refresh()
                        hide()
                    }}> Ок </Button>
                </div>
            </form>)
    }

    const hide = () => {
        props.setShow(false)
    }

    const showTextMessage = (text: String) => {
        setTextMessage(text)
        setShowMessage(true)
    }

    const save = () => {
        props.setCheckIdWorkplace(checkIdWorkplace)
        props.setCheckCodeShop(checkCodeShop)
        props.setIdWorkplace(idWorkplace)
        props.setCodeShop(codeShop)
        props.setCheckProblem(checkProblem)
        props.setProblemInterval(problemInterval)
        props.setIgnoreInterval(ignoreInterval)

        localStorage.setItem('checkIdWorkplace', String(checkIdWorkplace));
        localStorage.setItem('idWorkplace', String(idWorkplace));
        localStorage.setItem('checkCodeShop', String(checkCodeShop));
        localStorage.setItem('codeShop', String(codeShop));
        localStorage.setItem('checkProblem', String(checkProblem));
        localStorage.setItem('problemInterval', String(problemInterval));
        localStorage.setItem('ignoreInterval', String(ignoreInterval));
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
        if (props.workplaceStatus) {
            return `Редактирование типа плановой цены ${workplaceStatus.codeShop}`
        } else return "Фільтр статусів"
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

export default EditWorkplaceStatus