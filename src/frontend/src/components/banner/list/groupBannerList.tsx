// src/components/banner/list/GroupBannerList.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchGroupBanners, addGroupBanner, updateGroupBanner } from "../../../actions/groupBannerActions";
import { Grid, Button } from '@mui/material';
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { RootState } from "../../../types";
import GroupBannerModal from "../modals/groupBannerModal";
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';

const GroupBannerList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const groupBanners = useSelector((state: RootState) => state.groupBannerReducer.groupBanners);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<{ codeGroupBanner: number, name: string } | null>(null);

    useEffect(() => {
        dispatch(fetchGroupBanners());
    }, [dispatch]);

    const handleRowClick = (params: GridRowParams) => {
        const groupBanner = params.row;
        navigate(`/banners/group/${groupBanner.codeGroupBanner}`);
    };

    const handleViewAllBanners = () => {
        navigate(`/banners/all`);
    };

    const handleAddGroupBanner = (group: { name: string }) => {
        dispatch(addGroupBanner(group));
        setIsModalOpen(false);
    };

    const handleEditGroupBanner = (group: { name: string }) => {
        if (selectedGroup) {
            const patch = { name: group.name };
            dispatch(updateGroupBanner(selectedGroup.codeGroupBanner, patch));
        }
        setIsModalOpen(false);
        setSelectedGroup(null);
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

    const columns: GridColDef[] = [
        {
            field: 'edit',
            headerName: '',
            maxWidth: 50,
            align: "center",
            headerAlign: "center",
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
                <IconButton onClick={(event) => handleEditClick(event, params.row)}>
                    <EditIcon />
                </IconButton>
            )
        },
        {
            field: 'codeGroupBanner',
            headerName: 'Код',
            type: "number",
            maxWidth: 75,
            align: "center",
            headerAlign: "center",
            disableColumnMenu: true,
        },
        {
            field: 'name',
            headerName: 'Назва',
            type: "string",
            flex: 1,
            align: "center",
            headerAlign: "center",
            disableColumnMenu: true,
        },
    ];

    return (
        <div>
            <h3>Групи банерів</h3>
            <Button variant='contained' color='primary' onClick={() => setIsModalOpen(true)}>
                Нова група
            </Button>
            <Button variant='contained' color='primary' onClick={handleViewAllBanners}>
                Всі новини
            </Button>
            <DataGrid
                rows={groupBanners}
                columns={columns}
                getRowId={(row) => row.codeGroupBanner}
                onRowClick={handleRowClick}
                pageSizeOptions={[10, 13]}
                initialState={{
                    pagination: {
                        paginationModel: { pageSize: 10 }
                    }
                }}

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
