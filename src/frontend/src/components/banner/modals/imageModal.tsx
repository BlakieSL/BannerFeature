import React, { FC, useState } from "react";
import {
    Box,
    Button,
    IconButton,
    Modal,
    TextField,
    Typography
} from "@mui/material";
import ImageDataGrid from "../helperComponents/ImageDataGrid";
import DeleteIcon from "@material-ui/icons/Delete";

interface ImageModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (uploadedImages: any[]) => void;
}

const ImageModal: FC<ImageModalProps> = ({ open, onClose, onSave }) => {
    const [uploadedImages, setUploadedImages] = useState<any[]>([]);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
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

    const handleRemoveSelectedImages = () => {
        setUploadedImages((prev) => prev.filter((image) => !selectedRows.includes(image.codeImage)));
        setSelectedRows([]);
        setFileInputKey(prevKey => prevKey + 1);
    };

    const handleSave = () => {
        onSave(uploadedImages);
        handleClose();
    };

    const handleClose = () => {
        setUploadedImages([]);
        setFileInputKey(prevKey => prevKey + 1);
        onClose();
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
                        {selectedRows.length > 0 && (
                            <Box className="selectedItemsContainer">
                                <Box className="textContainer">
                                    <Typography variant="body1">
                                        {selectedRows.length} вибрано
                                    </Typography>
                                </Box>
                                <Box className="deleteIcon">
                                    <IconButton aria-label="delete" onClick={handleRemoveSelectedImages}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                        )}
                        <ImageDataGrid
                            images={uploadedImages}
                            height='500px'
                            showButtons={false}
                            onSelectionChange={(newSelectionModel) => setSelectedRows(newSelectionModel)}
                            checkboxSelection={true}
                        />
                    </Box>
                </Box>
                <Box className='actionsContainer'>
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
