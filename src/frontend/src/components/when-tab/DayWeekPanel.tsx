import React from 'react'
import styles from "./style.module.scss";
import Label from "../label-input/Label";
import Checkbox from "@material-ui/core/Checkbox";

type DayWeekPanelProps = {
    object: any
    setObject: (object: any) => void
    setChange: (change: boolean) => void
}

const DayWeekPanel: React.FC<DayWeekPanelProps> = (props: DayWeekPanelProps) => {
    const  bitSunday =    0b0000001
    const  bitMonday =    0b0000010
    const  bitTuesday =   0b0000100
    const  bitWednesday = 0b0001000
    const  bitThursday =  0b0010000
    const  bitFriday =    0b0100000
    const  bitSaturday =  0b1000000
    const getValueDayWeek = (bitDay: any) => {
        return ((props.object.dayWeek & bitDay) !== 0)
    }

    const setValueDayWeek = (event: any, bitDay: any) => {
        const prev = props.object.dayWeek & (~bitDay)
        if (event.target.checked) {
            props.object.dayWeek = prev | bitDay
        } else {
            props.object.dayWeek = prev
        }
        props.setObject({...props.object})
        props.setChange(true)
    }

    const dayCheckBox = (bitDay: any) => {
        return  <div className={styles.inputPanel}>
            <Checkbox
                checked={getValueDayWeek(bitDay)}
                defaultValue={'false'}
                onChange={(event) => setValueDayWeek(event, bitDay)}
                color="primary"
            />
        </div>
    }

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
}

export default DayWeekPanel