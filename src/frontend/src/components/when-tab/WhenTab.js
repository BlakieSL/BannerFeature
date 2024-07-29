import React, {useState} from "react";
import Label from "../label-input/Label";
import TextField from '@material-ui/core/TextField';
import moment from "moment";
import axios from "axios";
import {Button} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import ErrorField from "../error-field";
import TimeActivityTable from "./TimeActivityTable";
import MessageDialog from "../message-dialog/MessageDialog";
import styles from './style.module.scss'
import { makeStyles } from '@material-ui/core/styles';
import DatePanel from "./DatePanel";
import DayWeekPanel from "./DayWeekPanel";

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

const WhenTab = ({objectSource, url, classNameTabContent}) => {
    const [object, setObject] = useState(JSON.parse(JSON.stringify(objectSource)))
    const [change, setChange] = useState(false)
    // const [beginTime, setBeginTime] = useState('')
    // const [endTime, setEndTime] = useState('')
    const [showMessage, setShowMessage] = useState(false)
    const [textMessage, setTextMessage] = useState('')

    const getListTimeActivityItem = (timeActivity) => {
        return timeActivity?.split(',').map(text => text.trim()).filter(text => text.length > 0).sort() || []
    }
/*    const [timeActivityList, setTimeActivityList] = useState(getListTimeActivityItem(object["timeActivity"]))

    const  bitSunday =    0b0000001
    const  bitMonday =    0b0000010
    const  bitTuesday =   0b0000100
    const  bitWednesday = 0b0001000
    const  bitThursday =  0b0010000
    const  bitFriday =    0b0100000
    const  bitSaturday =  0b1000000*/

    const isErrorData = () => {
        return false //isErrorField("codeRule")
    }

    const isErrorField = (nameValue) => {
        const value = object[nameValue]
        return value === null || value === undefined || value.length===0
    }

    const cancelChange = () => {
        setObject(JSON.parse(JSON.stringify(objectSource)))
//        setTimeActivityList(getListTimeActivityItem(objectSource["timeActivity"]))
        setChange(false)
    }

/*    const setValue = (event, nameValue) => {
        const target =  event.target
        object[nameValue] = (target.type === 'checkbox') ? target.checked ? 1 : 0 : target.value
        setObject( {
                ...object
            }
        )
        if (nameValue === 'timeActivity') setTimeActivityList(getListTimeActivityItem(object.timeActivity))
        setChange(true)
    }

    const getValue = (targetType, nameValue) => {
        let value = object[nameValue]
        if (value === null || value === undefined) {
            value =  (targetType === 'boolean') ? false : ''
        }
        return (value)
    }


    const transformDateString = (dateString) => {
        return moment(dateString, 'DD.MM.YYYY HH:mm:ss').format('YYYY-MM-DD')
    }

    const transformTimeString = (dateString) => {
        return moment(dateString, 'DD.MM.YYYY HH:mm:ss').format('HH:mm')
    }

    const getDateValue = (nameValue) => {
        if (object[nameValue] === null ) return 'ДД.ММ.ГГГГ'
        return transformDateString(object[nameValue] )
    }

    const getTimeValue = (nameValue) => {
        if (object[nameValue] === null ) return nameValue === "dateBegin" ? "00:00" : "23:59"
        return transformTimeString(object[nameValue] )
    }

    const getFormattedDateValue = (nameValue) => {
        let date = null
        if (object[nameValue] == null ) return moment().format('DD.MM.YYYY')
        else return moment(object[nameValue], 'DD.MM.YYYY HH:mm:ss').format('DD.MM.YYYY')
    }*/


/*    const setDateValue = (event, nameValue) => {
        let dateStr = null
        let key = nameValue
        switch (nameValue) {
            case "dateBegin" : dateStr = event.target.value == null || event.target.value === "" ? null : (moment(event.target.value).format('DD.MM.YYYY') + ' ' + getTimeValue("dateBegin") + ':00')
                break;
            case "timeBegin" :
                dateStr = object["dateBegin"] == null ? null :(getFormattedDateValue("dateBegin") + ' ' + ((event.target.value == null || event.target.value === "") ? "00:00:00" : event.target.value + ':00'))
                key = "dateBegin"
                break
            case "dateEnd" : dateStr = dateStr = event.target.value == null || event.target.value === "" ? null : (moment(event.target.value).format('DD.MM.YYYY') + ' ' + getTimeValue("dateEnd") + ':59')
                break;
            case "timeEnd" :
                dateStr = object["dateEnd"] == null ? null :(getFormattedDateValue("dateEnd") + ' ' + ((event.target.value == null || event.target.value === "") ? "23:59:59" : event.target.value + ':59'))
                key = "dateEnd"
                break
        }
        object[key]=dateStr
        setObject( {...object})
        setChange(true)
    }*/

    const getBlockSaveCancel = () => {
        return <React.Fragment>
            {
                change &&
                <div className={"save-panel"}>
                    <Button variant="contained" onClick={saveParam} color="primary"
                            className={"button-add-save"}> Сохранить </Button>
                    &nbsp;&nbsp;
                    <Button variant="contained" onClick={cancelChange} color="primary"
                            className={"button-add-save"}> Отменить </Button>
                </div>
            }
        </React.Fragment>
    }

    const saveParam = () => {
        if (isErrorData() || isIncorrectDate()) return
        const options = {
            url: url,
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
            },
            data: JSON.stringify(object)
        };
        axios(options)
            .then(response => {setChange(false)})
            .catch(error => console.log(error));
    }

/*    const timeActivity = () => {
        return (
            <div>
                {addTimeActivity()}
                <TimeActivityTable
                    list={timeActivityList}
                    setValue={setValue}
                />
            </div>
        )
    }*/

    const classes = useStyles();
/*    const addTimeActivity =  () => {
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
    }*/

/*    const isIncorrectTimeRange = () => {
        return beginTime > endTime
    }

    const isExistsRange = () => {
        const list = getListTimeActivityItem(object.timeActivity)
        let exists = false
        list.forEach(range => {
            const timeList = range?.split('-').map(text => text.trim())
            if ((beginTime >= timeList[0] && beginTime <= timeList[1] ) ||
                (endTime >= timeList[0] && endTime <= timeList[1] )) exists = true
        })
        return exists
    }*/

    const showTextMessage = (text) => {
        setTextMessage(text)
        setShowMessage(true)
    }

/*    const addTime = () => {
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
        const list = getListTimeActivityItem(object.timeActivity)
        list.push(time)
        object.timeActivity = list.join()
        setTimeActivityList(getListTimeActivityItem(object.timeActivity))
        setObject({...object})
        setBeginTime('')
        setEndTime('')
        setChange(true)
    }

    const getValueDayWeek = (bitDay) => {
        return ((object.dayWeek & bitDay) !== 0)
    }

    const setValueDayWeek = (event, bitDay) => {
        const prev = object.dayWeek & (~bitDay)
        if (event.target.checked) {
            object.dayWeek = prev | bitDay
        } else {
            object.dayWeek = prev
        }
        setObject({...object})
        setChange(true)
    }

    const fieldWithError  = (field, name) => {
        return <div className={styles.inputPanel}>
            {field()}
            {isErrorField(name) && <ErrorField/>}
        </div>
    }

    const dayCheckBox = (bitDay) => {
        return  <div className={styles.inputPanel}>
            <Checkbox
                checked={getValueDayWeek(bitDay)}
                defaultValue={false}
                onChange={(event) => setValueDayWeek(event, bitDay)}
                color="primary"
            />
        </div>
    }

    const dateField = (nameValue) => {
        return <TextField
            id="datetime-local"
            type="date"
            value={getDateValue(nameValue)}
            defaultValue={getDateValue(nameValue)}
            onChange={event => setDateValue(event, nameValue)}
            InputLabelProps={{shrink: true, }}
        />
    }

    const timeField = (dateValue, timeValue) => {
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
            {timeField("dateBegin", "timeBegin")}
        </div>
    }

    const dateEndField = () => {
        return <div className={"rule-loyal-input-div"}>
            {dateField("dateEnd")}
            {timeField("dateEnd", "timeEnd")}
        </div>
    }*/

    const isIncorrectDate = () => {
        if (object.dateBegin == null || object.dateEnd == null) return false
        return moment(object.dateBegin, 'DD.MM.YYYY HH:mm:ss')  > moment(object.dateEnd, 'DD.MM.YYYY HH:mm:ss')
    }

    const message = () => {
        return <MessageDialog
            setShow={setShowMessage}
            show={showMessage}
            text={textMessage}
        />
    }

/*    const leftPanel = () => {
        return (<div className={styles.ruleLoyalWhenLeft}>
            <Label text="Дата начала"/>
            {dateBeginField()}

            <Label text="Дата окончания"/>
            {dateEndField()}

            <Label text="Время действия(периоды в формате ЧЧ:ММ-ЧЧ:ММ)"/>
            {timeActivity()}
        </div>)
    }

    const rightPanel = () => {
        return (<div className={styles.ruleLoyalWhenRight}>
            <Label text="Понедельник"/>
            {dayCheckBox(bitMonday)}

            <Label text="Вторник"/>
            {dayCheckBox(bitTuesday)}

            <Label text="Среда"/>
            {dayCheckBox(bitWednesday)}

            <Label text="Четверг"/>
            {dayCheckBox(bitThursday)}

            <Label text="Пятница"/>
            {dayCheckBox(bitFriday)}

            <Label text="Суббота"/>
            {dayCheckBox(bitSaturday)}

            <Label text="Воскресение"/>
            {dayCheckBox(bitSunday)}
        </div>)
    }*/

    const commonPanel = () => {
        return <div className={styles.commonPanel} >
            <DatePanel object={object} setObject={setObject} setChange={setChange}/>
            <DayWeekPanel object={object} setObject={setObject} setChange={setChange}/>
{/*
            {leftPanel()}
            {rightPanel()}
*/}
        </div>
    }

    return (
            <div id="when" className={classNameTabContent}>
                {commonPanel()}
                {isErrorData() && <div className={"warning"}>Заполните все поля помеченные *</div>}
                {isIncorrectDate() && <div className={"warning"}>Указаны некорректные даты - дата начала действия не может быть больше даты окончания</div>}
                {getBlockSaveCancel()}
                {showMessage && message()}
            </div>
    )

}

export default WhenTab