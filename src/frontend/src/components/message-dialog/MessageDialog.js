import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import {Button} from "@material-ui/core";

const MessageDialog = ({show, setShow, text}) => {
    const hide = () => {
        setShow(false)
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
                    <div className='message-body'>
                        <div><p>{text}</p></div>
                    </div>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={hide} color="primary"> Ок </Button>
            </DialogActions>
        </Dialog>
    )
}

export default MessageDialog

export const message = (setShowMessage, showMessage, textMessage) => {
    return <MessageDialog
        setShow={setShowMessage}
        show={showMessage}
        text={textMessage}
    />
}
