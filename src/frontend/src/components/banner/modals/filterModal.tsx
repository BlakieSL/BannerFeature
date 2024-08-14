import React, { FC, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { filterBanners } from '../../../actions/bannerActions';
import {BannerType, RootState} from '../../../types';
import classes from '../styles/filterModal.module.scss';

interface FilterModalProps {
    open: boolean;
    onClose: () => void;
    codeGroupBanner?: number;
}

const FilterModal: FC<FilterModalProps> = ({ open, onClose, codeGroupBanner }) => {
    const dispatch = useDispatch();
    const typeBanners = useSelector((state: RootState) => state.typeBannerReducer.typeBanners);
    const statusMap: { [key: number]: string } = {
        0: 'чернетка',
        1: 'заплановано',
        2: 'готово до відправки',
        3: 'відправлено'
    };

    const [status, setStatus] = useState<number | undefined>(undefined);
    const [statusChecked, setStatusChecked] = useState(false);
    const [type, setType] = useState<number | undefined>(undefined);
    const [typeChecked, setTypeChecked] = useState(false);

    const handleApply = async () => {
        const filters: any = {
            status: statusChecked ? status : undefined,
            codeTypeBanner: typeChecked ? type : undefined,
            codeGroupBanner: codeGroupBanner
        };
        await dispatch(filterBanners(filters));
        onClose();
    };

    const handleCancel = () => {
        setStatus(undefined);
        setStatusChecked(false);
        setType(undefined);
        setTypeChecked(false);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={(_, reason) => {
                if (reason !== 'backdropClick') {
                    handleCancel();
                }
            }}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle className={classes.title}>
                Виберіть умови для фільтра
            </DialogTitle>
            <DialogContent>
                <Box className={classes.filterRow}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={statusChecked}
                                onChange={() => setStatusChecked(!statusChecked)}
                            />
                        }
                        label="Статус:"
                        labelPlacement="start"
                        className={classes.label}
                    />
                    <FormControl
                        fullWidth
                        variant="outlined"
                        disabled={!statusChecked}
                        className={classes.text}
                    >
                        <Select
                            value={status ?? ''}
                            onChange={(e) => setStatus(Number(e.target.value))}
                        >
                            {Object.keys(statusMap).map((key) => (
                                <MenuItem key={key} value={key}>
                                    {statusMap[Number(key)]}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box className={classes.filterRow}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={typeChecked}
                                onChange={() => setTypeChecked(!typeChecked)}
                            />
                        }
                        label="Тип:"
                        labelPlacement="start"
                        className={classes.label}
                    />
                    <FormControl
                        fullWidth
                        variant="outlined"
                        disabled={!typeChecked}
                        className={classes.text}
                    >
                        <Select
                            value={type ?? ''}
                            onChange={(e) => setType(Number(e.target.value))}
                        >
                            {typeBanners.map((type : BannerType) => (
                                <MenuItem key={type.codeTypeBanner} value={type.codeTypeBanner}>
                                    {type.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} variant="contained">
                    СКАСУВАТИ
                </Button>
                <Button onClick={handleApply} variant="contained">
                    ЗАСТОСУВАТИ
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FilterModal;
