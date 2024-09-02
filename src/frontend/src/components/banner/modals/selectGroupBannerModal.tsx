import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Dialog, DialogTitle, DialogContent, DialogActions, Button} from '@mui/material';
import { RootState, GroupBanner } from '../../../types';
import { fetchGroupBanners } from '../../../actions/groupBannerActions';
import GroupBannerDataGrid from '../helperComponents/GroupBannerDataGrid';
import Loader from "../../loader/Loader";

interface SelectGroupBannerModalProps {
    open: boolean;
    onClose: () => void;
    onSelect: (selectedGroup: GroupBanner) => void;
}

const SelectGroupBannerModal: React.FC<SelectGroupBannerModalProps> = ({ open, onClose, onSelect }) => {
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch();
    const groupBanners = useSelector((state: RootState) => state.groupBannerReducer.groupBanners);

    useEffect(() => {
        (async () => {
            if (open) {
                setLoading(true);
                await dispatch(fetchGroupBanners());
                setLoading(false);
            }
        })();
    }, [dispatch, open]);


    const handleRowClick = (params: any) => {
        const selectedGroup = params.row as GroupBanner;
        onSelect(selectedGroup);
        onClose();
    }

    return (
        <Dialog
            open={open}
            onClose={(_, reason) => {
                if (reason !== 'backdropClick') {
                    onClose();
                }
            }}
            fullWidth maxWidth='lg'
        >
                <DialogTitle>Виберіть групу новин</DialogTitle>
                <DialogContent>
                    {loading ? <Loader/> : (
                        <GroupBannerDataGrid
                            groupBanners={groupBanners}
                            onRowClick={handleRowClick}
                            showEditColumn={false}
                            showButtons={false}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} variant='contained'>
                        ВІДМІНА
                    </Button>
                </DialogActions>
        </Dialog>
    );
}

export default SelectGroupBannerModal;
