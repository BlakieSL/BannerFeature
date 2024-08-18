import React, { FC } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    description: string;
}

const ConfirmDialog: FC<ConfirmDialogProps> = ({ open, onClose, onConfirm, description }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Увага</DialogTitle>
            <DialogContent>
                <p>{description}</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant='contained'>
                    ВІДМІНА
                </Button>
                <Button onClick={onConfirm} variant='contained'>
                    ОК
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmDialog;
