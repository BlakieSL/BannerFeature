import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchBannersByGroup, createBanner } from "../../../actions/bannerActions";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {BannerDtoRequest, RootState} from "../../../types";
import { fetchGroupBannerById } from "../../../actions/groupBannerActions";
import { Button } from "@mui/material";
import BannerModal from "../modals/bannerModal";

const BannerList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const banners = useSelector((state: RootState) => state.bannerListReducer.banners);
    const groupBannerDetails = useSelector((state: RootState) => state.currentGroupBannerReducer.groupBannerDetails);
    const { groupId } = useParams<{ groupId: string }>();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (groupId) {
            dispatch(fetchBannersByGroup(groupId));
            dispatch(fetchGroupBannerById(groupId));
        }
    }, [dispatch, groupId]);

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
            align: "center",
            headerAlign: "center",
            disableColumnMenu: true,
        },
        {
            field: 'dateCreate',
            headerName: 'Дата створення',
            type: 'date',
            flex: 1,
            headerAlign: "center",
            align: "center",
            disableColumnMenu: true,
            valueGetter: (params) => new Date(params.row.dateCreate)
        },
        {
            field: 'title',
            headerName: 'Назва',
            type: 'string',
            flex: 1,
            align: "center",
            headerAlign: "center",
            disableColumnMenu: true,
        },
        {
            field: 'codeTypeBanner',
            headerName: 'Код типу банера',
            type: 'number',
            flex: 1,
            align: "center",
            headerAlign: "center",
            disableColumnMenu: true,
        },
        {
            field: 'plannedDate',
            headerName: 'Запланована дата',
            type: 'dateTime',
            flex: 1,
            headerAlign: "center",
            align: "center",
            disableColumnMenu: true,
            valueGetter: (params) => new Date(params.row.plannedDate)
        },
        {
            field: 'status',
            headerName: 'Статус',
            type: 'string',
            flex: 1,
            headerAlign: "center",
            align: "center",
            disableColumnMenu: true,
            valueGetter: (params) => statusMap[params.row.status as number] || 'Unknown'
        }
    ];

    const handleAddBanner = (newBanner: BannerDtoRequest) => {
        dispatch(createBanner(newBanner));
        setIsModalOpen(false);
    };


    return (
        <div>
            <Link to="/group-banners">назад до груп</Link>
            <h3>Банери групи: {groupId} "{groupBannerDetails?.name}"</h3>
            <Button
                variant="contained"
                color="primary"
                onClick={() => setIsModalOpen(true)}
            >
                Додати новий банер
            </Button>
            <DataGrid
                rows={banners}
                columns={columns}
                getRowId={(row) => row.codeBanner}
                pageSizeOptions={[10, 13]}
                initialState={{
                    pagination: {
                        paginationModel: { pageSize: 10 }
                    }
                }}
            />
            {groupId && (
                <BannerModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleAddBanner}
                    groupCode={parseInt(groupId, 10)}
                    title="Додати новий банер"
                />
            )}
        </div>
    );
};

export default BannerList;
