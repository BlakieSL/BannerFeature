import React, {FC} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { Typography, Button } from '@mui/material';

interface ErrorModalProps {
    open: boolean;
    onClose: () => void;
    errorMessage: string;
}
const ErrorModal: FC<ErrorModalProps> = ({ open, errorMessage, onClose }) => {
    return (
        <Dialog
            open={open}
            onClose={(_, reason) => {
                if (reason !== 'backdropClick') {
                    onClose();
                }
            }}
        >
            <DialogTitle>УВАГА</DialogTitle>
            <DialogContent>
                <Typography>{errorMessage}</Typography>
            </DialogContent>
            <DialogActions>
                <Button variant='contained' onClick={onClose}>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ErrorModal;
