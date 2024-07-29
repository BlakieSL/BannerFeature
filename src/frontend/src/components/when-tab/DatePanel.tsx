import React, {useEffect, useState} from "react";
import styles from "./style.module.scss";
import Label from "../label-input/Label";
import moment from "moment";
import TextField from "@material-ui/core/TextField";
import TimeActivityTable from "./TimeActivityTable";
import {Button} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import MessageDialog from "../message-dialog/MessageDialog";

type DatePanelProps = {
    object: any
    setObject: (object: any) => void
    setChange: (change: boolean) => void
    hideTime: boolean|null|undefined
}


const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 100,
    },
}));

const DatePanel:React.FC<DatePanelProps> = (props: DatePanelProps) => {
    const [beginTime, setBeginTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [showMessage, setShowMessage] = useState(false)
    const [textMessage, setTextMessage] = useState('')

    const getListTimeActivityItem = (timeActivity: string) => {
        return timeActivity?.split(',').map(text => text.trim()).filter(text => text.length > 0).sort() || []
    }
    const [timeActivityList, setTimeActivityList] = useState(getListTimeActivityItem(props.object["timeActivity"]))

    useEffect(() => {
        setTimeActivityList(getListTimeActivityItem(props.object["timeActivity"]))
    }, [props.object["timeActivity"]])

    const transformDateString = (dateString: string) => {
        return moment(dateString, 'DD.MM.YYYY HH:mm:ss').format('YYYY-MM-DD')
    }

    const transformTimeString = (dateString: string) => {
        return moment(dateString, 'DD.MM.YYYY HH:mm:ss').format('HH:mm')
    }

    const getDateValue = (nameValue: string) => {
        if (props.object[nameValue] == null ) return 'ДД.ММ.ГГГГ'
        return transformDateString(props.object[nameValue] )
    }

    const getTimeValue = (nameValue: string) => {
        if (props.hideTime) return "00:00"
        if (props.object[nameValue] == null ) return nameValue === "dateBegin" ? "00:00" : "23:59"
        return transformTimeString(props.object[nameValue] )
    }

    const getFormattedDateValue = (nameValue: string) => {
        let date = null
        if (props.object[nameValue] == null ) return moment().format('DD.MM.YYYY')
        else return moment(props.object[nameValue], 'DD.MM.YYYY HH:mm:ss').format('DD.MM.YYYY')
    }

    const setDateValue = (event: any, nameValue: string) => {
        let dateStr = null
        let key = nameValue
        switch (nameValue) {
            case "dateBegin" : dateStr = event.target.value == null || event.target.value === "" ? null : (moment(event.target.value).format('DD.MM.YYYY') + ' ' + getTimeValue("dateBegin") + ':00')
                break;
            case "timeBegin" :
                dateStr = props.object["dateBegin"] == null ? null :(getFormattedDateValue("dateBegin") + ' ' + ((event.target.value == null || event.target.value === "") ? "00:00:00" : event.target.value + ':00'))
                key = "dateBegin"
                break
            case "dateEnd" : dateStr = dateStr = event.target.value == null || event.target.value === "" ? null : (moment(event.target.value).format('DD.MM.YYYY') + ' ' + getTimeValue("dateEnd") + (props.hideTime ? ':00' : ':59'))
                break;
            case "timeEnd" :
                dateStr = props.object["dateEnd"] == null ? null :(getFormattedDateValue("dateEnd") + ' ' + ((event.target.value == null || event.target.value === "") ? "23:59:59" : event.target.value + ':59'))
                key = "dateEnd"
                break
        }
        const obj = JSON.parse(JSON.stringify(props.object))
        obj[key]=dateStr
        props.setObject(obj)
        props.setChange(true)
    }

    const dateField = (nameValue: string) => {
        return <TextField
            id="datetime-local"
            type="date"
            value={getDateValue(nameValue)}
            defaultValue={getDateValue(nameValue)}
            onChange={event => setDateValue(event, nameValue)}
            InputLabelProps={{shrink: true, }}
        />
    }

    const timeField = (dateValue: string, timeValue: string) => {
        return <TextField
            id="time"
            type="time"
            value={getTimeValue(dateValue)}
            onChange={event => setDateValue(event, timeValue)}
            InputLabelProps={{
                shrink: true,
            }}
            inputProps={{
                step: 300, // 5 min
            }}
        />
    }

    const dateBeginField = () => {
        return <div className={"rule-loyal-input-div"}>
            {dateField("dateBegin")}
            {!props.hideTime && timeField("dateBegin", "timeBegin")}
        </div>
    }

    const dateEndField = () => {
        return <div className={"rule-loyal-input-div"}>
            {dateField("dateEnd")}
            {!props.hideTime && timeField("dateEnd", "timeEnd")}
        </div>
    }

    const timeActivity = () => {
        return (
            <div>
                {addTimeActivity()}
                <TimeActivityTable
                    list={timeActivityList}
                    setValue={setValue}
                />
            </div>
        )
    }

    const setValue = (event: any, nameValue: string) => {
        const target =  event.target
        props.object[nameValue] = (target.type === 'checkbox') ? target.checked ? 1 : 0 : target.value
        props.setObject( {
                ...props.object
            }
        )
        if (nameValue === 'timeActivity') setTimeActivityList(getListTimeActivityItem(props.object.timeActivity))
        props.setChange(true)
    }

    const classes = useStyles();
    const addTimeActivity =  () => {
        return <>
            <text> c </text>
            <TextField
                id="time"
                type="time"
                value={beginTime}
                onChange={event => setBeginTime(event.target.value)}
                className={classes.textField}
                InputLabelProps={{
                    shrink: true
                }}
                inputProps={{
                    step: 300, // 5 min
                }}
            />
            <text> по </text>
            <TextField
                id="time"
                type="time"
                value={endTime}
                onChange={event => setEndTime(event.target.value)}
                InputLabelProps={{
                    shrink: true,
                }}
                inputProps={{
                    step: 300, // 5 min
                }}
            />
            <Button
                variant="contained"
                onClick={event => addTime() }
                size={"small"}
            >Добавить</Button>
        </  >
    }

    const isIncorrectTimeRange = () => {
        return beginTime > endTime
    }

    const isExistsRange = () => {
        const list = getListTimeActivityItem(props.object.timeActivity)
        let exists = false
        list.forEach(range => {
            const timeList = range?.split('-').map(text => text.trim())
            if ((beginTime >= timeList[0] && beginTime <= timeList[1] ) ||
                (endTime >= timeList[0] && endTime <= timeList[1] )) exists = true
        })
        return exists
    }

    const showTextMessage = (text: any) => {
        setTextMessage(text)
        setShowMessage(true)
    }

    const addTime = () => {
        if (beginTime.length === 0 || endTime.length ===0) return
        if (isIncorrectTimeRange()) {
            showTextMessage("Начальное время не может быть больше конечного")
            return
        }
        if (isExistsRange()) {
            showTextMessage("Новый диапазон не должен пересекаться с существующим. ")
            return
        }
        const time = beginTime + '-' + endTime + ','
        const list = getListTimeActivityItem(props.object.timeActivity)
        list.push(time)
        props.object.timeActivity = list.join()
        setTimeActivityList(getListTimeActivityItem(props.object.timeActivity))
        props.setObject({...props.object})
        setBeginTime('')
        setEndTime('')
        props.setChange(true)
    }

    const message = () => {
        return <MessageDialog
            setShow={setShowMessage}
            show={showMessage}
            text={textMessage}
        />
    }

    const isIncorrectDate = () => {
        if (props.object.dateBegin == null || props.object.dateEnd == null) return false
        return moment(props.object.dateBegin, 'DD.MM.YYYY HH:mm:ss')  > moment(props.object.dateEnd, 'DD.MM.YYYY HH:mm:ss')
    }
    return (<div className={styles.ruleLoyalWhenLeft}>
        <Label text="Дата начала"/>
        {dateBeginField()}

        <Label text="Дата окончания"/>
        {dateEndField()}

        <Label text="Время действия(периоды в формате ЧЧ:ММ-ЧЧ:ММ)"/>
        {timeActivity()}
        {showMessage && message()}

    </div>)
}

export default DatePanel