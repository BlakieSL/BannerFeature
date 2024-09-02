import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchGroupBanners, addGroupBanner, updateGroupBanner } from '../../../actions/groupBannerActions';
import { Button, CircularProgress, Box, Typography} from '@mui/material';
import { GridRowParams } from '@mui/x-data-grid';
import { RootState } from '../../../types';
import GroupBannerModal from '../modals/groupBannerModal';
import GroupBannerDataGrid from '../helperComponents/GroupBannerDataGrid';
import Loader from "../../loader/Loader";

const GroupBannerList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const groupBanners = useSelector((state: RootState) => state.groupBannerReducer.groupBanners);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<{ codeGroupBanner: number, name: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setLoading(true);
            await dispatch(fetchGroupBanners());
            setLoading(false);
        })();
    }, [dispatch]);


    const handleRowClick = (params: GridRowParams) => {
        const groupBanner = params.row;
        navigate(`/banners/group/${groupBanner.codeGroupBanner}`);
    }

    const handleViewAllBanners = () => {
        navigate(`/banners/all`);
    }

    const handleAddGroupBanner = async (group: { name: string }) => {
        await dispatch(addGroupBanner(group));
        setIsModalOpen(false);
    }

    const handleEditGroupBanner = async (group: { name: string }) => {
        if (selectedGroup) {
            const patch = { name: group.name };
            await dispatch(updateGroupBanner(selectedGroup.codeGroupBanner, patch));
            setIsModalOpen(false);
            setSelectedGroup(null);
        }
    }

    const handleEditClick = (event: React.MouseEvent, group: { codeGroupBanner: number, name: string }) => {
        event.stopPropagation();
        setSelectedGroup(group);
        setIsEditing(true);
        setIsModalOpen(true);
    }

    const handleModalClose = () => {
        setIsModalOpen(false);
        setIsEditing(false);
        setSelectedGroup(null);
    }

    if (loading) {
        return <Loader />;
    }

    return (
        <Box>
            <Box className='headerContainerBase'>
                <Typography variant='h4'>
                    Групи новин
                </Typography>
            </Box>
            <GroupBannerDataGrid
                groupBanners={groupBanners}
                onRowClick={handleRowClick}
                onEditClick={handleEditClick}
                onAddNewGroupClick={() => setIsModalOpen(true)}
                onViewAllBannersClick={handleViewAllBanners}
            />
            <GroupBannerModal
                open={isModalOpen}
                onClose={handleModalClose}
                onSave={isEditing ? handleEditGroupBanner : handleAddGroupBanner}
                initialData={selectedGroup}
                title={isEditing ? `Редагування групи ${selectedGroup?.codeGroupBanner} '${selectedGroup?.name}'` : 'Нова група'}
            />
        </Box>
    );
}

export default GroupBannerList;
/*
                <Box className='listsActions'>
                    <Button variant='contained' onClick={() => setIsModalOpen(true)}>
                        НОВА ГРУПА
                    </Button>
                    <Button variant='contained' onClick={handleViewAllBanners}>
                        ВСІ НОВИНИ
                    </Button>
                </Box>
 */