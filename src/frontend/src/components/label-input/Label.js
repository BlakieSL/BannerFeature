import React from "react";

const Label = ({text}) => {
    return (<div className='label-input'>{text}{text.length>0?':':''}</div>)
}

export default Label