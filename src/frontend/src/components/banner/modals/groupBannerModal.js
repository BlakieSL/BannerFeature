// src/components/modals/GroupBannerModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';


const GroupBannerModal = ({ open, onClose, onSave, initialData, title }) => {
    const [name, setName] = useState('');

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

    return (
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
                <Button variant="contained" color="primary" onClick={handleSave}>
                    Зберегти
                </Button>
                <Button variant="contained" color="primary" onClick={onClose}>
                    Закрити
                </Button>
            </Box>
        </Modal>
    );
};

export default GroupBannerModal;
