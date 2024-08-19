import React, {ChangeEvent, FC, useEffect, useState} from 'react';
import {
    Button,
    Box,
    Typography,
    Modal,
} from '@mui/material';
import { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import {
    BannerDto,
    BannerDtoRequest,
    GroupBanner,
    RootState,
    SimplifiedClientDto,
    SimplifiedGroupClientDto
} from '../../../types';
import GroupClientModal from '../modals/groupClientModal';
import ClientModal from './clientsModal';
import { useDispatch, useSelector } from 'react-redux';
import {
    copyBanner,
    createBanner,
    deleteBanner,
    moveBanner,
    updateBanner
} from '../../../actions/bannerActions';
import ErrorModal from './errorModal';
import classes from '../styles/bannerModal.module.scss';
import SelectGroupBannerModal from './selectGroupBannerModal';
import ConfirmDialog from './confirmModal';
import {quickSearchToolbar} from "../../standart-element/SearchToolbar";
import BannerTabContent from "../helperComponents/BannerContent";
import ImageModal from "./imageModal";
import {createMultipleImages, deleteImages, fetchBannerImages} from "../../../actions/imageActions";

interface BannerModalProps {
    open: boolean;
    onClose: () => void;
    initialData?: BannerDto;
    groupBannerDetails: GroupBanner;
    title: string;
}

const BannerModal: FC<BannerModalProps> = ({ open, onClose, initialData, groupBannerDetails, title }) => {
    const dispatch = useDispatch();
    const typeBanners = useSelector((state: RootState) => state.typeBannerReducer.typeBanners);
    const statuses = useSelector((state: RootState) => state.statusListReducer.statuses);
    const channels = useSelector((state: RootState) => state.channelListReducer.channels);
    const images = useSelector((state: RootState) => state.imageListReducer.bannerImages);
    const initialBannerState: BannerDto = {
        codeGroupBanner: groupBannerDetails.codeGroupBanner,
    };
    const [banner, setBanner] = useState<BannerDto>(initialData || initialBannerState);
    const [bannerCopy, setBannerCopy] = useState<BannerDto | null> (null);
    const [selectedGroup, setSelectedGroup] = useState<GroupBanner | null>(null);
    const [actionType, setActionType] = useState<'copy' | 'move' | null>(null);
    const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
    const [tabIndex, setTabIndex] = useState(0);
    const [error, setError] = useState('');
    const [hasChanges, setHasChanges] = useState(false);
    const [isGroupClientModalOpen, setIsGroupClientModalOpen] = useState(false);
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [isSelectGroupOpen, setIsSelectGroupOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedImages, setSelectedImages] = useState<GridRowSelectionModel>([]);

    useEffect(() => {
        (async () => {
            if (initialData) {
                setBanner(initialData);
                setBannerCopy(initialData);
            } else {
                setBanner(initialBannerState);
            }
        })();
    }, [initialData, groupBannerDetails, dispatch, open]);

    const getChangedFields = (): Partial<BannerDtoRequest> => {
        const changedFields: Partial<BannerDtoRequest> = {};

        if (bannerCopy) {
            (Object.keys(banner) as Array<keyof BannerDto>).forEach((key) => {
                if (banner[key] !== bannerCopy[key]) {
                    if (key === 'groupClients') {
                        changedFields.groupClients = banner.groupClients
                            ? Array.from(banner.groupClients).map(gc => gc.codeGroup)
                            : [];
                    } else if (key === 'singleClients') {
                        changedFields.singleClients = banner.singleClients
                            ? Array.from(banner.singleClients).map(sc => sc.codeClient)
                            : [];
                    } else {
                        changedFields[key as keyof BannerDtoRequest] = banner[key] !== undefined
                            ? banner[key] as any
                            : null;
                    }
                }
            });
        }

        return changedFields;
    };

    const convertBannerToRequest = (banner: BannerDto): BannerDtoRequest => {
        console.log(banner)
        if (!banner.title || !banner.codeTypeBanner || !banner.clientTitle) {
            throw new Error('Required fields are missing');
        }

        const bannerRequest: BannerDtoRequest = {
            title: banner.title,
            codeTypeBanner: banner.codeTypeBanner,
            codeGroupBanner: banner.codeGroupBanner,
            clientTitle: banner.clientTitle,
            groupClients: [],
            singleClients: []
        }

        if (banner.codeBanner) bannerRequest.codeBanner = banner.codeBanner;
        if (banner.body) bannerRequest.body = banner.body;
        if (banner.plannedDate) bannerRequest.plannedDate = banner.plannedDate;
        if (banner.status) bannerRequest.status = banner.status;
        if (banner.sendResult) bannerRequest.sendResult = banner.sendResult;
        if (banner.externalId) bannerRequest.externalId = Number(banner.externalId);
        if (banner.note) bannerRequest.note = banner.note;
        if (banner.channel) bannerRequest.channel = banner.channel;
        if (banner.link) bannerRequest.link = banner.link;
        if (banner.barcode) bannerRequest.barcode = banner.barcode;

        bannerRequest.groupClients = banner.groupClients ? Array.from(banner.groupClients).map(gc => gc.codeGroup) : [];
        bannerRequest.singleClients = banner.singleClients ? Array.from(banner.singleClients).map(sc => sc.codeClient) : [];

        console.log(bannerRequest)
        return bannerRequest;
    }

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setBanner({ ...banner, [name]: value || undefined });
        setHasChanges(true);
    }

    const handleSingleSelectChange = (event: any, key: keyof BannerDto) => {
        const value = event.target.value as number;
        setBanner({ ...banner, [key]: value || undefined });
        setHasChanges(true);
    }

    const handleRemoveSelectedClients = () => {
        setBanner((prevBanner) => ({
            ...prevBanner,
            singleClients: new Set(
                Array.from(prevBanner.singleClients || []).filter(
                    client => !selectedRows.includes(`client-${client.codeClient}`)
                )
            ),
            groupClients: new Set(
                Array.from(prevBanner.groupClients || []).filter(
                    group => !selectedRows.includes(`group-${group.codeGroup}`)
                )
            )
        }));
        setSelectedRows([]);
        setHasChanges(true);
    }

    const handleDeleteSelectedImage = async () => {
        if(selectedImages.length > 0) {
            try{
                const ids = selectedImages.map(id => Number(id));
                await deleteImages(ids);
                setSelectedImages([]);
                await dispatch(fetchBannerImages(banner.codeBanner));
            } catch (error : any) {
                setError(error.response.data || 'Error deleting images');
                setIsErrorModalOpen(true);
            }
        }
    }

    const handleImagesSave = async (selectedImages: any[]) => {
        try {
            const typeValue = 10;
            const codeValue = banner.codeBanner;
            const typeRef = 0;

            const files = selectedImages.map(i => i.file);
            await createMultipleImages(typeValue, codeValue, typeRef, files);
            dispatch(fetchBannerImages(banner.codeBanner))

            setHasChanges(true);
        } catch (error) {
            setError('Помилка завантаження зображень.');
            setIsErrorModalOpen(true);
        }
    };

    const handleGroupClientsSave = (selectedGroups: SimplifiedGroupClientDto[]) => {
        setBanner((prevBanner) => ({
            ...prevBanner,
            groupClients: new Set([
                ...Array.from(prevBanner.groupClients || []),
                ...selectedGroups
            ])
        }));
        setHasChanges(true);
    }

    const handleClientsSave = (selectedClients: SimplifiedClientDto[]) => {
        setBanner((prevBanner) => ({
            ...prevBanner,
            singleClients: new Set([
                ...Array.from(prevBanner.singleClients || []),
                ...selectedClients
            ])
        }));
        setHasChanges(true);
    }

    const handleSave = async () => {
        try {
            if (initialData) {
                const changedFields = getChangedFields();
                console.log(bannerCopy);
                console.log(changedFields);
                if (Object.keys(changedFields).length > 0) {
                    await updateBanner(banner.codeBanner!, changedFields);
                }
            } else {
                const bannerRequest = convertBannerToRequest(banner);
                await createBanner(bannerRequest);
            }
            onClose();
        } catch (error: any) {
            if (error.response) {
                console.error("Error response:", error.response.data);
                setError(error.response.data || 'Error saving banner');
            } else {
                console.error("Error:", error.message);
                setError('An unexpected error occurred: ' + error.message);
            }
            setIsErrorModalOpen(true);
        }
    }

    const handleDelete = async () => {
        try {
            if (banner.codeBanner) {
                await deleteBanner(banner.codeBanner);
                onClose();
            }
        } catch (error: any) {
            setError(error.response.data || 'Error deleting banner');
            setIsErrorModalOpen(true);
        }
    }

    const handleCloseErrorModal = () => {
        setIsErrorModalOpen(false);
    }

    const handleCancel = () => {
        if (initialData) {
            setBanner(initialData);
        } else {
            setBanner(initialBannerState);
        }
        setHasChanges(true);
    }

    const handleOpenSelectGroupModal = (type: 'copy' | 'move') => {
        setActionType(type);
        setIsSelectGroupOpen(true);
    }

    const handleGroupSelected = (group: GroupBanner) => {
        setSelectedGroup(group);
        setIsSelectGroupOpen(false);
        setIsConfirmOpen(true);
    }

    const handleConfirmAction = async () => {
        try {
            if (selectedGroup && actionType) {
                if (actionType === 'copy') {
                    await copyBanner(banner.codeBanner, selectedGroup.codeGroupBanner);
                } else if (actionType === 'move') {
                    await moveBanner(banner.codeBanner, selectedGroup.codeGroupBanner);
                }
            }
        } catch (error: any) {
            setError(error.response.data || 'Error copying/moving banner')
            setIsErrorModalOpen(true);
        }
        setIsConfirmOpen(false);
        onClose();
    }

    const isFormValid = () => !!(banner.title && banner.codeTypeBanner && banner.codeGroupBanner && banner.clientTitle);

    const columns: GridColDef[] = [
        {
            field: 'type',
            headerName: 'Тип',
            flex: 1,
            headerAlign: 'left',
            align: 'left',
            disableColumnMenu: true,
        },
        {
            field: 'code',
            headerName: 'Код',
            flex: 1,
            headerAlign: 'left',
            align: 'left',
            disableColumnMenu: true,
        },
        {
            field: 'title',
            headerName: 'Назва',
            flex: 1,
            headerAlign: 'left',
            align: 'left',
            disableColumnMenu: true,
        }
    ];

    const rows = [
        ...Array.from(banner.groupClients || []).map(gc => ({
            id: `group-${gc.codeGroup}`,
            type: 'Группа',
            code: gc.codeGroup,
            title: gc.nameGroup
        })),
        ...Array.from(banner.singleClients || []).map(sc => ({
            id: `client-${sc.codeClient}`,
            type: 'Клієнт',
            code: sc.codeClient,
            title: sc.surname,
        })),
    ];

    function toolbar() {
        return quickSearchToolbar(
            [
                {
                    func: () => { setIsGroupClientModalOpen(true); },
                    text: 'ВИБІР ГРУП',
                    disabled: false
                },
                {
                    func: () => { setIsClientModalOpen(true); },
                    text: 'ВИБІР КЛІЄНТІВ',
                    disabled: false
                }
            ]
        );
    }

    return (
        <>
            <Modal
                open={open}
                onClose={(_, reason) => {
                    if (reason !== 'backdropClick') {
                        onClose();
                    }
                }}
            >
                <Box className='bannerModal'>
                    <Typography id='banner-modal-title' variant='h6' component='h2'>
                        {title}
                    </Typography>
                    <Box className={classes.bannerContent}>
                        <BannerTabContent
                            tabIndex={tabIndex}
                            banner={banner}
                            handleTabChange={handleTabChange}
                            handleInputChange={handleInputChange}
                            handleSingleSelectChange={handleSingleSelectChange}
                            isFormValid={isFormValid}
                            hasChanges={hasChanges}
                            handleSave={handleSave}
                            handleCancel={handleCancel}
                            columns={columns}
                            rows={rows}
                            selectedRows={selectedRows}
                            handleRemoveSelectedClients={handleRemoveSelectedClients}
                            toolbar={toolbar}
                            channels={channels}
                            statuses={statuses}
                            typeBanners={typeBanners}
                            groupBannerDetails={groupBannerDetails}
                            setSelectedRows={setSelectedRows}
                            initialData={initialData}
                            images={images}
                            onAddNewImageClick={() => setIsImageModalOpen(true)}
                            onSelectionChange={(newSelectionModel) => setSelectedImages(newSelectionModel)}
                            selectedImages={selectedImages}
                            handleDeleteSelectedImage={handleDeleteSelectedImage}
                        />
                    </Box>
                    <Box className={classes.footerActions}>
                        {initialData && (
                            <>
                                <Button variant='contained' onClick={() => handleOpenSelectGroupModal('copy')}>
                                    ДУБЛЮВАТИ
                                </Button>
                                <Button variant='contained' onClick={() => handleOpenSelectGroupModal('move')}>
                                    ПЕРЕМІСТИТИ
                                </Button>
                                <Button variant='contained' onClick={handleDelete}>
                                    ВИДАЛИТИ
                                </Button>
                            </>
                        )}
                        <Button variant='contained' onClick={onClose}>
                            ЗАКРИТИ
                        </Button>
                    </Box>

                    <GroupClientModal
                        open={isGroupClientModalOpen}
                        onClose={() => setIsGroupClientModalOpen(false)}
                        onSave={handleGroupClientsSave}
                        selectedGroupClients={Array.from(banner.groupClients || new Set())}
                    />
                    <ClientModal
                        open={isClientModalOpen}
                        onClose={() => setIsClientModalOpen(false)}
                        onSave={handleClientsSave}
                    />
                    <ImageModal
                        open={isImageModalOpen}
                        onClose={() => setIsImageModalOpen(false)}
                        onSave={handleImagesSave}
                    />
                </Box>
            </Modal>
            <ErrorModal open={isErrorModalOpen} onClose={handleCloseErrorModal} errorMessage={error}/>
            <SelectGroupBannerModal
                open={isSelectGroupOpen}
                onClose={() => setIsSelectGroupOpen(false)}
                onSelect={(group) => handleGroupSelected(group)}
            />
            <ConfirmDialog
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmAction}
                description={actionType === 'copy' ?
                    `Копіювати новину ${banner.codeBanner} '${banner.title}' у папку ${selectedGroup?.codeGroupBanner} '${selectedGroup?.name}'?` :
                    `Переместить новину ${banner.codeBanner} '${banner.title}' у папку ${selectedGroup?.codeGroupBanner} '${selectedGroup?.name}'?`}
            />
        </>
    );
}

export default React.memo(BannerModal);

/*
<Box className={classes.buttonsContainer}>
    <Button variant='contained' onClick={() => setIsGroupClientModalOpen(true)}>
        ВИБІР ГРУП
    </Button>
    <Button variant='contained' onClick={() => setIsClientModalOpen(true)}>
        ВИБІР КЛІЄНТІВ
    </Button>
</Box>


 {rows.length > 0 && (
    <>
        {selectedRows.length > 0 && (
            <Box className='selectedItemsContainer'>
                <Box className='textContainer'>
                    <Typography variant='body1'>
                        {selectedRows.length} вибрано
                    </Typography>
                </Box>
                <Box className='deleteIcon'>
                    <IconButton aria-label='delete' onClick={handleRemoveSelectedClients}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            </Box>
        )}
        <DefaultDataGrid
            rows={rows}
            columns={columns}
            onSelectionModelChange={(newSelectionModel) => setSelectedRows(newSelectionModel)}
            checkboxSelection={true}
        />
    </>
 */
