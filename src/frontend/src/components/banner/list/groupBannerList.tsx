import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchGroupBanners, addGroupBanner, updateGroupBanner } from "../../../actions/groupBannerActions";
import { Grid, Button, CircularProgress } from '@mui/material';
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { RootState } from "../../../types";
import GroupBannerModal from "../modals/groupBannerModal";
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import GroupBannerDataGrid from "../helperComponents/GroupBannerDataGrid";

const GroupBannerList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const groupBanners = useSelector((state: RootState) => state.groupBannerReducer.groupBanners);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<{ codeGroupBanner: number, name: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await dispatch(fetchGroupBanners());
            setLoading(false);

        };

        fetchData();
    }, [dispatch]);

    const handleRowClick = (params: GridRowParams) => {
        const groupBanner = params.row;
        navigate(`/banners/group/${groupBanner.codeGroupBanner}`);
    };

    const handleViewAllBanners = () => {
        navigate(`/banners/all`);
    };

    const handleAddGroupBanner = async (group: { name: string }) => {
        try {
            await dispatch(addGroupBanner(group));
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error adding group banner:', error);
        }
    };

    const handleEditGroupBanner = async (group: { name: string }) => {
        if (selectedGroup) {
            try {
                const patch = { name: group.name };
                await dispatch(updateGroupBanner(selectedGroup.codeGroupBanner, patch));
                setIsModalOpen(false);
                setSelectedGroup(null);
            } catch (error) {
                console.error('Error editing group banner:', error);
            }
        }
    };

    const handleEditClick = (event: React.MouseEvent, group: { codeGroupBanner: number, name: string }) => {
        event.stopPropagation();
        setSelectedGroup(group);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setIsEditing(false);
        setSelectedGroup(null);
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <div>
            <h3>Групи банерів</h3>
            <Button variant='contained' onClick={() => setIsModalOpen(true)}>
                Нова група
            </Button>
            <Button variant='contained' onClick={handleViewAllBanners}>
                Всі новини
            </Button>
            <GroupBannerDataGrid
                groupBanners={groupBanners}
                onRowClick={handleRowClick}
                onEditClick={handleEditClick}
            />
            <GroupBannerModal
                open={isModalOpen}
                onClose={handleModalClose}
                onSave={isEditing ? handleEditGroupBanner : handleAddGroupBanner}
                initialData={selectedGroup}
                title={isEditing ? `Редагування групи ${selectedGroup?.codeGroupBanner} '${selectedGroup?.name}'` : 'Нова група'}
            />
        </div>
    );
}

export default GroupBannerList;
