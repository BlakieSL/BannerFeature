import React, {useState} from "react";
import imageDelete from "../images/del32.png";
import {refreshEditForm, refreshInvoiceList} from "../actions";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

const styles = {
    button: {
        marginLeft: '1rem',
        marginRight: '1rem',
        width: '100px'
    }
}

const ConfirmDelete = ({text, func, refresh}) => {
    const [show, setShow] = useState(false)
    const hide = () => {
        setShow(false)
    }

    const onClick = (event) => {
        setShow(true)
    }

    const onConfirm = () => {
        func()
        refresh()
        hide()
    }

    return (
        <React.Fragment>
            <button  onClick={() =>onClick()} title = "Удалить"><img src ={imageDelete} /> </button>
            {
                show &&
                <div className='modal-confirm'>
                    <div className='modal-body-confirm'>
                        <h1>Внимание</h1>
                        <p>{text}</p>
                        <button onClick={()=>onConfirm()} style={styles.button} className="btn btn-outline-success" >Да</button>
                        <button onClick={()=>hide()} style={styles.button} className="btn btn-outline-success" >Нет</button>
                    </div>
                </div>
            }
        </React.Fragment>
    );
}

export default ConfirmDelete