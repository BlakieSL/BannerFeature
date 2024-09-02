import React from 'react';
import { Box, Typography, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import classes from '../styles/bannerModal.module.scss';
interface SelectFieldProps {
    label: string;
    value: string | number;
    name: string;
    options: { value: string | number; label: string; disabled?: boolean; }[];
    onChange: any
    required?: boolean;
    disabled?: boolean;
}

const CustomSelectField: React.FC<SelectFieldProps> = ({ label, value, name, options, onChange, required = false, disabled = false }) => {
    return (
        <Box className={classes.customBox}>
            <Typography variant='body1' className='label'>
                {label}
                {required && <span className={classes.customAsterisk}>*</span>}
            </Typography>
            <Select
                className='text'
                value={value ?? ''}
                onChange={(e) => onChange(e, name)}
                name={name}
                fullWidth
                disabled={disabled}
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value} disabled={option.disabled}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </Box>
    );
};


export default CustomSelectField;
