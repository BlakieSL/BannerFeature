import React, { FC } from 'react';
import { TextField, Box, Typography } from '@mui/material';
import classes from '../styles/bannerModal.module.scss';
interface CustomTextFieldProps {
    label: string;
    name?: string;
    value: string | number;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    required?: boolean;
}

const CustomTextField: FC<CustomTextFieldProps> = ({ label, name, value, onChange, disabled = false, required = false }) => {
    return (
        <Box className='inputRow'>
            <Typography variant='body1'  className='label'>
                {label}
                {required && (
                    <span className={classes.customAsterisk}>*</span>
                )}
            </Typography>
            <TextField
                className='text'
                name={name}
                fullWidth
                value={value}
                onChange={onChange}
                disabled={disabled}
            />
        </Box>
    );
};

export default CustomTextField;
