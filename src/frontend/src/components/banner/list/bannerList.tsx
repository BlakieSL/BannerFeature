import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
    fetchBannersByGroup,
    createBanner,
    updateBanner,
    fetchBannerById,
    clearBanner,
    fetchBanners
} from "../../../actions/bannerActions";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { BannerDtoRequest, RootState } from "../../../types";
import { fetchGroupBannerById } from "../../../actions/groupBannerActions";
import {Button, CircularProgress} from "@mui/material";
import BannerModal from "../modals/bannerModal";

const BannerList = () => {
    const dispatch = useDispatch();
    const banners = useSelector((state: RootState) => state.bannerListReducer.banners);
    const currentBanner = useSelector((state: RootState) => state.currentBannerReducer.selectedBanner);
    const groupBannerDetails = useSelector((state: RootState) => state.currentGroupBannerReducer.groupBannerDetails);
    const { groupId } = useParams<{ groupId: string }>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            if (groupId) {
                await dispatch(fetchBannersByGroup(groupId));
                await dispatch(fetchGroupBannerById(groupId));
            } else {
                await dispatch(fetchBanners());
                setTitle('Всі новини');
            }
            setLoading(false);
        };

        fetchData();
    }, [dispatch, groupId]);

    useEffect(() => {
        if (groupBannerDetails && groupId) {
            setTitle(`Новини групи: ${groupId} "${groupBannerDetails.name}"`);
        }
    }, [groupBannerDetails, groupId]);

    useEffect(() => {
        if (isEditing && currentBanner && !groupId && currentBanner.codeGroupBanner) {
            dispatch(fetchGroupBannerById(currentBanner.codeGroupBanner));
        }
    }, [dispatch, currentBanner, groupId, isEditing]);

    const handleRowClick = async (params: any) => {
        await dispatch(fetchBannerById(params.row.codeBanner));
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleModalClose = async () => {
        if(groupId){
            await dispatch(fetchBannersByGroup(groupId))
        }
        dispatch(clearBanner());
        setIsModalOpen(false);
        setIsEditing(false);
    };

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
            headerAlign: 'left',
            align: 'left',
            valueGetter: (params) => new Date(params.row.dateCreate),
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
            headerAlign: 'left',
            align: 'left',
            valueGetter: (params) => new Date(params.row.plannedDate),
        },
        {
            field: 'status',
            headerName: 'Статус',
            type: 'string',
            flex: 1,
            disableColumnMenu: true,
            headerAlign: 'left',
            align: 'left',
            valueGetter: (params) => statusMap[params.row.status as number] || 'Unknown',
        }
    ];

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <div>
            <Link to="/group-banners">назад до груп</Link>
            <h3>{title}</h3>
            {groupId && (
                <Button variant='contained' onClick={() => {setIsModalOpen(true)}}>
                    Додати новину
                </Button>
            )}
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
            />
            <BannerModal
                open={isModalOpen}
                onClose={handleModalClose}
                initialData={isEditing ? currentBanner : null}
                groupBannerDetails={groupBannerDetails}
                title={isEditing ? "Оновити новину" : "Додати новину"}
            />
        </div>
    );
};

export default BannerList;
