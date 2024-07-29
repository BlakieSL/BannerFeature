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

const Confirm = ({show, setShow, text, func, refresh=null}) => {
    const hide = () => {
        setShow(false)
    }

    const onConfirm = () => {
        func()
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
                <Button variant="contained" onClick={hide} color="primary"> Отмена </Button>
                <Button variant="contained" onClick={onConfirm} color="primary" autoFocus> Ок</Button>
            </DialogActions>
        </Dialog>
    );
}

export default Confirm