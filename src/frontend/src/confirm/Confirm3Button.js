import React from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Button} from "@material-ui/core";


const styles = {
    button: {
        marginLeft: '1rem',
        marginRight: '1rem',
        width: '100px'
    }
}

const Confirm3Button = ({show, setShow, text, func1, func2, textButton1, textButton2, refresh=null}) => {
    const hide = () => {
        setShow(false)
    }

    const onButton1Click = () => {
        func1()
        if (refresh) refresh()
        hide()
    }

    const onButton2Click = () => {
        func2()
        if (refresh) refresh()
        hide()
    }


    return (
        <Dialog
            open={show}
            onClose={() => setShow(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth={true}
            maxWidth={'sm'}
        >
            <DialogTitle id="alert-dialog-title">Внимание</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <div className='confirm-body'>
                        <p>{text}</p>
                    </div>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={onButton1Click} color="primary" autoFocus> {textButton1}</Button>
                <Button variant="contained" onClick={onButton2Click} color="primary" autoFocus> {textButton2}</Button>
                <Button variant="contained" onClick={hide} color="primary"> Отмена </Button>
            </DialogActions>
        </Dialog>
    );
}

export default Confirm3Button