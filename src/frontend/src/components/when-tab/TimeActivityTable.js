import React from "react";

const TimeActivityTable = ({list, setValue}) => {

    const removeItem = (index) => {
        let newList = JSON.parse(JSON.stringify(list))
        newList.splice(index, 1)
        const event = {"target":{"value":newList.join()}}
        setValue(event, "timeActivity")
    }

    const row = (text, index) => {
        return <tr>
            <td className={"column-time-activity"}>{text}</td>
            <td> <button
                className={"button-time-delete-activity"}
                onClick={(event => removeItem(index))}>X</button>
            </td>
        </tr>
    }

    return (<div className={"panel-time-activity"} >
            <table>
                <tr><th></th> <th></th></tr>
                <tbody>
                {
                    list.map((text, index) => row(text, index))
                }
                </tbody>
            </table>
        </div>)
}

export default TimeActivityTable