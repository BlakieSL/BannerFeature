import React, { FC, useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Modal,
    TextField,
    Typography
} from "@mui/material";
import ImageDataGrid from "../helperComponents/ImageDataGrid";

interface ImageModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (uploadedImages: any[]) => void;
}

const ImageModal: FC<ImageModalProps> = ({ open, onClose, onSave }) => {
    const [uploadedImages, setUploadedImages] = useState<any[]>([]);
    const [fileInputKey, setFileInputKey] = useState(0);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onloadend = () => {
                const newImage = {
                    codeImage: uploadedImages.length + 1,
                    image: reader.result?.toString().split(',')[1],
                    file: file,
                };
                setUploadedImages((prev) => [...prev, newImage]);
            };

            reader.readAsDataURL(file);
        }
    };


    const handleClear = () => {
        setUploadedImages([]);
        setFileInputKey(prevKey => prevKey + 1);
    };

    const handleSave = () => {
        onSave(uploadedImages);
        handleClose();
    };

    const handleClose = () => {
        handleClear()
        onClose();
    }

    return (
        <Modal
            open={open}
            onClose={(_, reason) => {
                if (reason !== 'backdropClick') {
                    onClose();
                }
            }}
        >
            <Box className='imageModal'>
                <Typography variant='h6'>Завантаження зображення</Typography>
                <Box>
                    <Box className='actionBase'>
                        <TextField
                            key={fileInputKey}
                            type='file'
                            onChange={handleFileChange}
                            inputProps={{ accept: 'image/*' }}
                        />
                    </Box>
                    <Box className='dataGridContainer'>
                        <ImageDataGrid
                            images={uploadedImages}
                            height='500px'
                            showButtons={false}
                        />
                    </Box>
                </Box>
                <Box className='actionsContainer'>
                    <Button variant='contained' onClick={handleClear} disabled={uploadedImages.length === 0}>
                        СКАСУВАТИ
                    </Button>
                    <Button variant="contained" onClick={handleSave} disabled={uploadedImages.length === 0}>
                        ЗБЕРЕГТИ
                    </Button>
                    <Button variant="contained" onClick={handleClose}>
                        ЗАКРИТИ
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ImageModal;
