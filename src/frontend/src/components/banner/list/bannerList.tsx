import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
    fetchBannersByGroup,
    createBanner,
    updateBanner,
    fetchBannerById,
    clearBanner, fetchBanners
} from "../../../actions/bannerActions";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { BannerDtoRequest, RootState } from "../../../types";
import { fetchGroupBannerById } from "../../../actions/groupBannerActions";
import { Button } from "@mui/material";
import BannerModal from "../modals/bannerModal";

const BannerList = () => {
    const dispatch = useDispatch();
    const banners = useSelector((state: RootState) => state.bannerListReducer.banners);
    const groupBannerDetails = useSelector((state: RootState) => state.currentGroupBannerReducer.groupBannerDetails);
    const currentBanner = useSelector((state: RootState) => state.currentBannerReducer.selectedBanner);
    const { groupId } = useParams<{ groupId: string }>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState('');

    useEffect(() => {
        if (groupId && groupBannerDetails) {
            dispatch(fetchBannersByGroup(groupId));
            dispatch(fetchGroupBannerById(groupId));
            setTitle(`Новини групи: ${groupId} "${groupBannerDetails?.name}"`);
        }  else {
            dispatch(fetchBanners());
            setTitle('Всі новини');
        }
    }, [dispatch, groupId, groupBannerDetails]);

    const statusMap: { [key: number]: string } = {
        0: 'чернетка',
        1: 'заплановано',
        2: 'готово до відправки',
        3: 'відправлено'
    };

    const columns: GridColDef[] = [
        {
            field: 'codeBanner',
            headerName: 'Код',
            type: 'number',
            maxWidth: 75,
            disableColumnMenu: true,
            headerAlign: 'left',
            align: 'left',
        },
        {
            field: 'dateCreate',
            headerName: 'Дата створення',
            type: 'date',
            flex: 1,
            disableColumnMenu: true,
            valueGetter: (params) => new Date(params.row.dateCreate),
            headerAlign: 'left',
            align: 'left',
        },
        {
            field: 'title',
            headerName: 'Назва',
            type: 'string',
            flex: 1,
            disableColumnMenu: true,
            headerAlign: 'left',
            align: 'left',
        },
        {
            field: 'codeTypeBanner',
            headerName: 'Код типу банера',
            type: 'number',
            flex: 1,
            disableColumnMenu: true,
            headerAlign: 'left',
            align: 'left',
        },
        {
            field: 'plannedDate',
            headerName: 'Запланована дата',
            type: 'dateTime',
            flex: 1,
            disableColumnMenu: true,
            valueGetter: (params) => new Date(params.row.plannedDate),
            headerAlign: 'left',
            align: 'left',
        },
        {
            field: 'status',
            headerName: 'Статус',
            type: 'string',
            flex: 1,
            disableColumnMenu: true,
            valueGetter: (params) => statusMap[params.row.status as number] || 'Unknown',
            headerAlign: 'left',
            align: 'left',
        }
    ];

    const handleRowClick = (params:   any) => {
        dispatch(fetchBannerById(params.row.codeBanner));
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleAddBanner = (newBanner: BannerDtoRequest) => {
        dispatch(createBanner(newBanner));
        setIsModalOpen(false);
    };

    const handleEditBanner = (updatedBanner: BannerDtoRequest) => {
        if(currentBanner) {
            dispatch(updateBanner(currentBanner.codeBanner, updatedBanner))
        }
        dispatch(clearBanner());
        setIsModalOpen(false);
        setIsEditing(false);
    }

    const handleModalClose = () => {
        dispatch(clearBanner());
        setIsModalOpen(false);
        setIsEditing(false);
    };

    return (
        <div>
            <Link to="/group-banners">назад до груп</Link>
            <h3>{title}</h3>
            <Button variant='contained' color='primary' onClick={() => {setIsModalOpen(true)}}>
                Додати новину
            </Button>
            <DataGrid
                rows={banners}
                columns={columns}
                getRowId={(row) => row.codeBanner}
                onRowClick={handleRowClick}
                pageSizeOptions={[10, 13]}

                initialState={{
                    pagination: {
                        paginationModel: { pageSize: 10 }
                    }
                }}
                sx={{
                    '& .MuiDataGrid-cell:focus': {
                        outline: 'none',
                    },
                    '& .MuiDataGrid-cell:focus-within': {
                        outline: 'none',
                    },
                }}
            />
            <BannerModal
                open={isModalOpen}
                onClose={handleModalClose}
                onSave={isEditing? handleEditBanner : handleAddBanner}
                initialData={isEditing ? currentBanner : null}
                groupCode={ groupId ? parseInt(groupId, 10) : null}
                title={isEditing ? "Оновити новину" : "Додати новину"}
            />
        </div>
    );
};

export default BannerList;
