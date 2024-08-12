// src/components/modals/ErrorModal.tsx
import React, {FC} from 'react';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
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
            onClose={onClose}
        >
            <DialogTitle>Внимание</DialogTitle>
            <DialogContent>
                <Typography>{errorMessage}</Typography>
            </DialogContent>
            <DialogActions>
                <Button variant='contained' color='primary' onClick={onClose}>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ErrorModal;
