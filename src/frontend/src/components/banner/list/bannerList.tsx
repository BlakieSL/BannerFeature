import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import {
    fetchBannersByGroup,
    fetchBannerById,
    clearBanner,
    fetchBanners, deleteBanners
} from '../../../actions/bannerActions';
import {GridColDef, GridRowSelectionModel} from '@mui/x-data-grid';
import {BannerType, RootState} from '../../../types';
import {fetchGroupBannerById } from '../../../actions/groupBannerActions';
import {Box, Button, Checkbox, CircularProgress, FormControlLabel, IconButton, Typography} from '@mui/material';
import BannerModal from '../modals/bannerModal';
import FilterModal from '../modals/filterModal';
import DefaultDataGrid from '../helperComponents/DefaultDataGrid';
import DeleteIcon from '@material-ui/icons/Delete';
import {customTable} from "../../standart-element/DynamicElement";
import {quickSearchToolbar} from "../../standart-element/SearchToolbar";
import {fetchChannels, fetchStatuses} from "../../../actions/designationActions";
import Loader from "../../loader/Loader";
import {fetchTypeBanners} from "../../../actions/typeBannerActions";

const BannerList = () => {
    const dispatch = useDispatch();
    const banners = useSelector((state: RootState) => state.bannerListReducer.banners);
    const currentBanner = useSelector((state: RootState) => state.currentBannerReducer.selectedBanner);
    const groupBannerDetails = useSelector((state: RootState) => state.currentGroupBannerReducer.groupBannerDetails);
    const typeBanners = useSelector((state: RootState) => state.typeBannerReducer.typeBanners);
    const statuses = useSelector((state: RootState) => state.statusListReducer.statuses);
    const { groupId } = useParams<{ groupId: string }>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [groupOperationsEnabled, setGroupOperationsEnabled] = useState(false);
    const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            if (groupId) {
                await dispatch(fetchBannersByGroup(groupId));
                await dispatch(fetchGroupBannerById(groupId));
            } else {
                await dispatch(fetchBanners());
                setTitle('Всі новини');
            }
            await dispatch(fetchTypeBanners());
            await dispatch(fetchStatuses());
            await dispatch(fetchChannels());
            setLoading(false);

        })();
    }, [dispatch, groupId]);

    useEffect(() => {
        (async () => {
            if (isEditing && currentBanner && !groupId && currentBanner.codeGroupBanner) {
                setLoading(true);
                await dispatch(fetchGroupBannerById(currentBanner.codeGroupBanner));
                setLoading(false);
            }
        })();
    }, [dispatch, currentBanner, groupId, isEditing]);

    useEffect(() => {
        if (groupBannerDetails && groupId) {
            setTitle(`Новини групи: ${groupId} '${groupBannerDetails.name}'`);
        }
    }, [groupBannerDetails, groupId]);


    const handleDeleteSelected = async () => {
        if (selectedRows.length > 0) {
            try {
                const ids = selectedRows.map(id => Number(id));
                await deleteBanners(ids);
                setSelectedRows([]);
                if (groupId) {
                    await dispatch(fetchBannersByGroup(groupId));
                } else {
                    await dispatch(fetchBanners());
                }
            } catch (error) {
                console.error('This should not be triggered', error);
            }
        }
    }

    const handleRowClick = async (params: any) => {
        setLoading(true);
        await dispatch(fetchBannerById(params.row.codeBanner));
        setLoading(false);
        setIsEditing(true);
        setIsModalOpen(true);
    }

    const handleModalClose = async () => {
        if(groupId){
            await dispatch(fetchBannersByGroup(groupId))
        }
        dispatch(clearBanner());
        setIsModalOpen(false);
        setIsEditing(false);
    }

    const handleFilterModalClose = () => {
        setIsFilterModalOpen(false);
    }

    const getStatusDescription = (status: number) => {
        const statusObject = statuses.find((s: any) => s.shortValue === status);
        return statusObject ? statusObject.description : 'Невідомий';
    }

    const getTypeDescription = (type: number) => {
        const typeObject = typeBanners.find((t : BannerType) => t.codeTypeBanner === type);
        return typeObject ? typeObject.name : 'Невідомий';
    }

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
            field: 'type',
            headerName: 'Тип банера',
            type: 'string',
            flex: 1,
            disableColumnMenu: true,
            headerAlign: 'left',
            align: 'left',
            valueGetter: (params) => getTypeDescription(params.row.codeTypeBanner),
        },
        {
            field: 'plannedDate',
            headerName: 'Запланована дата',
            flex: 1,
            disableColumnMenu: true,
            headerAlign: 'left',
            align: 'left',
            renderCell: (params) => {
                const plannedDate = params.row.plannedDate;
                return params.row.plannedDate ? new Date(plannedDate).toLocaleString() : 'Не назначено';
            },
        },
        {
            field: 'status',
            headerName: 'Статус',
            type: 'string',
            flex: 1,
            disableColumnMenu: true,
            headerAlign: 'left',
            align: 'left',
            valueGetter: (params) => getStatusDescription(params.row.status),
        }
    ];

    if (loading) {
        return <Loader/>;
    }

    function toolbar() {
        return quickSearchToolbar(
            [
                {
                    func: () => { setIsModalOpen(true); },
                    text: 'ДОДАТИ НОВИНУ',
                    disabled: !groupId
                },
                {
                    func: () => { setIsFilterModalOpen(true); },
                    text: 'ФІЛЬТР',
                    disabled: false
                }
            ]
        );
    }

    return (
        <Box>
            <Link to='/group-banners'>назад до груп</Link>
            <Box className='headerContainerBase'>
                <Typography variant='h4'>{title}</Typography>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={groupOperationsEnabled}
                            onChange={() => setGroupOperationsEnabled(!groupOperationsEnabled)}
                        />
                    }
                    label='Групові операції: '
                    labelPlacement='start'
                />
            </Box>
            {groupOperationsEnabled && selectedRows.length > 0 && (
                <Box className='selectedItemsContainer'>
                    <Box className='textContainer'>
                        <Typography variant='body1'>
                            {selectedRows.length} вибрано
                        </Typography>
                    </Box>
                    <Box className='deleteIcon'>
                        <IconButton aria-label='delete' onClick={handleDeleteSelected}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                </Box>
            )}
            {customTable({
                height: 'calc(100vh - 204px)',
                columns: columns,
                rows: banners,
                toolbar: toolbar,
                loading: false,
                getRowId: (row : any) => row.codeBanner,
                onRowClick: handleRowClick,
                onSelectionChange: (newSelectionModel) => setSelectedRows(newSelectionModel),
                checkboxSelection: groupOperationsEnabled,
            })}

            <BannerModal
                open={isModalOpen}
                onClose={handleModalClose}
                {...(isEditing && { initialData: currentBanner })}
                groupBannerDetails={groupBannerDetails}
                title={isEditing ? 'Оновити новину' : 'Додати новину'}
            />
            <FilterModal
                open={isFilterModalOpen}
                onClose={handleFilterModalClose}
                codeGroupBanner={groupId ? parseInt(groupId) : undefined}
            />
        </Box>
    );
}

export default BannerList;
/*
            <DefaultDataGrid
                rows={banners}
                columns={columns}
                getRowId={(row) => row.codeBanner}
                onRowClick={handleRowClick}
                onSelectionModelChange={(newSelectionModel) => setSelectedRows(newSelectionModel)}
                checkboxSelection={groupOperationsEnabled}
            />
 */

/*
                <Box className='listsActions'>
                    {groupId && (
                        <Button variant='contained' onClick={() => {setIsModalOpen(true)}}>
                            ДОДАТИ НОВИНУ
                        </Button>
                    )}
                    <Button variant='contained' onClick={() => {setIsFilterModalOpen(true)}}>
                        ФІЛЬТР
                    </Button>
                </Box>
 */