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
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch } from "react-redux";
import { addPendingImage } from "../../../actions/imageActions";
import ErrorModal from "./errorModal";

interface ImageModalProps {
    open: boolean;
    onClose: () => void;
    onSave: () => void;
}

const ImageModal: FC<ImageModalProps> = ({ open, onClose, onSave }) => {
    const dispatch = useDispatch();
    const [uploadedImages, setUploadedImages] = useState<{
        codeImage: number;
        image: string;
        file: File;
        width: number;
        height: number;
        fileSize: number;
    }[]>([]);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [fileInputKey, setFileInputKey] = useState(0);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            if (file.size > 500 * 1024) {
                setError("Розмір файлу перевищує 500KB. Будь ласка, виберіть інший файл.");
                setIsErrorModalOpen(true);
                return;
            }

            const reader = new FileReader();
            const img = new Image();

            img.onload = () => {
                const newImage = {
                    codeImage: uploadedImages.length + 1,
                    image: reader.result?.toString().split(',')[1]!,
                    file: file,
                    width: img.width,
                    height: img.height,
                    fileSize: file.size,
                    isPending: true,
                };
                setUploadedImages((prevImages) => [...prevImages, newImage]);
            };

            reader.onloadend = () => {
                img.src = reader.result?.toString()!;
            };

            reader.readAsDataURL(file);
        }
    };

    const handleRemoveSelectedImages = () => {
        setUploadedImages((prevImages) => prevImages.filter(image => !selectedRows.includes(image.codeImage)));
        setSelectedRows([]);
        setFileInputKey(prevKey => prevKey + 1);
    };

    const handleSave = () => {
        uploadedImages.forEach(image => dispatch(addPendingImage(image)));
        onSave();
        handleClose();
    };

    const handleClose = () => {
        setUploadedImages([]);
        setFileInputKey(prevKey => prevKey + 1);
        onClose();
    };

    const handleCloseErrorModal = () => {
        setIsErrorModalOpen(false);
    }


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
                                displayBannerCode={false}
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
            <ErrorModal open={isErrorModalOpen} onClose={handleCloseErrorModal} errorMessage={error}/>
        </>
    );
};

export default ImageModal;
