import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { deleteGroupBanner } from "../../../actions/groupBannerActions";
import { useDispatch } from "react-redux";
import ErrorModal from "./errorModal";
import classes from '../styles/groupBannerModal.module.scss';

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
    }, [initialData, open]);

    const handleSave = () => {
        onSave({ name });
        setName("");
    };

    const handleDelete = async () => {
        const errorMessage = await dispatch(deleteGroupBanner(initialData.codeGroupBanner));
        if (errorMessage) {
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
                <Box className={classes.modalContainer}>
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
                    <Box className={classes.modalActions}>
                        <Button variant='contained' onClick={handleSave}>
                            ЗБЕРЕГТИ
                        </Button>
                        {initialData && (
                            <Button variant='contained' onClick={handleDelete}>
                                ВИДАЛИТИ
                            </Button>
                        )}
                        <Button variant='contained' onClick={onClose}>
                            ЗАКРИТИ
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
