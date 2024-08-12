// src/components/modals/GroupBannerModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { deleteGroupBanner } from "../../../actions/groupBannerActions";
import {useDispatch} from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import ErrorModal from "./errorModal";

const GroupBannerModal = ({ open, onClose, onSave, initialData, title }) => {
    const [name, setName] = useState('');
    const dispatch = useDispatch();
    const [error, setError] = useState('');
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
        } else {
            setName('');
        }
    }, [initialData]);

    const handleSave = () => {
        onSave({ name });
        setName("");
    };

    const handleDelete = async () => {
        const errorMessage = await dispatch(deleteGroupBanner(initialData.codeGroupBanner));
        if(errorMessage) {
            setError(errorMessage);
            setIsErrorModalOpen(true);
        } else {
            onClose();
        }
    };

    const handleCloseErrorModal = () => {
        setIsErrorModalOpen(false);
    };

    return (
        <>
            <Modal
                open={open}
                onClose={(_, reason) => {
                    if (reason !== 'backdropClick') {
                        onClose();
                    }
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {title}
                    </Typography>
                    <TextField
                        label="Назва"
                        fullWidth
                        margin="normal"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1}}>
                        <Button variant="contained" color="primary" onClick={handleSave}>
                            Зберегти
                        </Button>
                        {initialData && (
                            <Button variant='contained' color='primary' onClick={handleDelete}>
                                Видалити
                            </Button>
                        )}
                        <Button variant='contained' color='primary' onClick={onClose}>
                            Закрити
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <ErrorModal
                open={isErrorModalOpen}
                onClose={handleCloseErrorModal}
                errorMessage={error}
            />
        </>
    );
};

export default GroupBannerModal;
