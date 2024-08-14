import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {Dialog, DialogTitle, DialogContent, DialogActions, Button, Box} from "@mui/material";
import { RootState, GroupBanner } from "../../../types";
import { fetchGroupBanners } from "../../../actions/groupBannerActions";
import GroupBannerDataGrid from "../helperComponents/GroupBannerDataGrid";
import classes from "../styles/selectGroupBannerModal.module.scss"
interface SelectGroupBannerModalProps {
    open: boolean;
    onClose: () => void;
    onSelect: (selectedGroup: GroupBanner) => void;
}

const SelectGroupBannerModal: React.FC<SelectGroupBannerModalProps> = ({ open, onClose, onSelect }) => {
    const dispatch = useDispatch();
    const groupBanners = useSelector((state: RootState) => state.groupBannerReducer.groupBanners);

    useEffect(() => {
        const fetchData = async () => {
            if (open) {
                dispatch(fetchGroupBanners());
            }
        };
        fetchData();
    }, [dispatch, open]);

    const handleRowClick = (params: any) => {
        const selectedGroup = params.row as GroupBanner;
        onSelect(selectedGroup);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={(_, reason) => {
                if (reason !== 'backdropClick') {
                    onClose();
                }
            }}
            fullWidth maxWidth="lg"
        >
                <DialogTitle>Виберіть групу банерів</DialogTitle>
                <DialogContent>
                    <GroupBannerDataGrid
                        groupBanners={groupBanners}
                        onRowClick={handleRowClick}
                        showEditColumn={false}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} variant="contained">
                        ВІДМІНА
                    </Button>
                </DialogActions>
        </Dialog>
    );
};

export default SelectGroupBannerModal;
