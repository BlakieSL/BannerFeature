import React, {ChangeEvent, FC, useEffect, useState} from 'react';
import {
    Button,
    TextField,
    Box,
    Typography,
    Select,
    Modal,
    MenuItem,
    Checkbox,
    FormControlLabel, IconButton,
} from '@mui/material';
import {
    TabPanel,
    TabContext,
} from '@mui/lab/';
import { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import {
    BannerDto,
    BannerDtoRequest,
    BannerType, GroupBanner,
    RootState,
    SimplifiedClientDto,
    SimplifiedGroupClientDto
} from '../../../types';
import { SelectChangeEvent } from '@mui/material/Select';
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
import StyledTabList from '../helperComponents/StyledTabList';
import classes from '../styles/bannerModal.module.scss';
import { fetchTypeBanners } from '../../../actions/typeBannerActions';
import CustomTextField from '../helperComponents/CustomTextField';
import SelectGroupBannerModal from './selectGroupBannerModal';
import ConfirmDialog from './confirmModal';
import DefaultDataGrid from '../helperComponents/DefaultDataGrid';
import DeleteIcon from '@material-ui/icons/Delete';

interface BannerModalProps {
    open: boolean;
    onClose: () => void;
    initialData: BannerDto | null;
    groupBannerDetails: GroupBanner;
    title: string;
}

const BannerModal: FC<BannerModalProps> = ({ open, onClose, initialData, groupBannerDetails, title }) => {
    const dispatch = useDispatch();
    const typeBanners = useSelector((state: RootState) => state.typeBannerReducer.typeBanners);
    const [tabIndex, setTabIndex] = useState(0);
    const [isGroupClientModalOpen, setIsGroupClientModalOpen] = useState(false);
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [error, setError] = useState('');
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [isSelectGroupOpen, setIsSelectGroupOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<GroupBanner | null>(null);
    const [actionType, setActionType] = useState<'copy' | 'move' | null>(null);
    const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
    const initialBannerState: BannerDto = {
        codeGroupBanner: groupBannerDetails.codeGroupBanner,
    };
    const [banner, setBanner] = useState<BannerDto>(initialData || initialBannerState);

    useEffect(() => {
        (async () => {
            if (initialData) {
                setBanner(initialData);
            } else {
                setBanner(initialBannerState);
            }
            await dispatch(fetchTypeBanners());
        })();
    }, [initialData, groupBannerDetails, dispatch, open]);


    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setBanner({ ...banner, [name]: value || undefined });
        setHasChanges(true);
    };

    const handleSingleSelectChange = (event: SelectChangeEvent<number>, key: keyof BannerDto) => {
        const value = event.target.value as number;
        setBanner({ ...banner, [key]: value || undefined });
        setHasChanges(true);
    };

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
    };

    const convertBannerToRequest = (banner: BannerDto): BannerDtoRequest => {
        if (!banner.title || !banner.codeTypeBanner) {
            throw new Error('Required fields are missing');
        }

        const bannerRequest: BannerDtoRequest = {
            title: banner.title,
            codeTypeBanner: banner.codeTypeBanner,
            codeGroupBanner: banner.codeGroupBanner,
        };

        if (banner.codeBanner !== undefined) bannerRequest.codeBanner = banner.codeBanner;
        if (banner.body) bannerRequest.body = banner.body;
        if (banner.plannedDate) bannerRequest.plannedDate = banner.plannedDate;
        if (banner.status !== undefined) bannerRequest.status = banner.status;
        if (banner.sendResult) bannerRequest.sendResult = banner.sendResult;
        if (banner.externalId !== undefined) bannerRequest.externalId = Number(banner.externalId);
        if (banner.note) bannerRequest.note = banner.note;

        if(banner.codeBanner !== undefined) {
            bannerRequest.groupClients = banner.groupClients ? Array.from(banner.groupClients).map(gc => gc.codeGroup) : [];
            bannerRequest.singleClients = banner.singleClients ? Array.from(banner.singleClients).map(sc => sc.codeClient) : [];
        } else {
            if (banner.groupClients && banner.groupClients.size > 0) {
                bannerRequest.groupClients = Array.from(banner.groupClients).map(gc => gc.codeGroup);
            }
            if (banner.singleClients && banner.singleClients.size > 0) {
                bannerRequest.singleClients = Array.from(banner.singleClients).map(sc => sc.codeClient);
            }
        }
        return bannerRequest;
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
    };

    const handleClientsSave = (selectedClients: SimplifiedClientDto[]) => {
        setBanner((prevBanner) => ({
            ...prevBanner,
            singleClients: new Set([
                ...Array.from(prevBanner.singleClients || []),
                ...selectedClients
            ])
        }));
        setHasChanges(true);
    };

    const handleSave = async () => {
        try {
            const bannerRequest = convertBannerToRequest(banner);
            if (initialData) {
                await updateBanner(bannerRequest.codeBanner, bannerRequest);
            } else {
                await createBanner(bannerRequest);
            }
            onClose();
        } catch (error: any) {
            setError(error.response.data || 'Error saving banner');
            setIsErrorModalOpen(true);
        }
    };

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
    };

    const handleCloseErrorModal = () => {
        setIsErrorModalOpen(false);
    };

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
    };

    const handleGroupSelected = (group: GroupBanner) => {
        setSelectedGroup(group);
        setIsSelectGroupOpen(false);
        setIsConfirmOpen(true);
    };

    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        setBanner({ ...banner, status: isChecked ? 2 : undefined });
        setHasChanges(true);
    };


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
    };

    const isFormValid = () => {
        return banner.title && banner.codeTypeBanner && banner.codeGroupBanner;
    };

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
                        <TabContext value={tabIndex.toString()}>
                            <StyledTabList
                                onChange={handleTabChange}
                                tabs={[
                                    { label: 'Основні', value: '0' },
                                    { label: 'Дата', value: '1' },
                                    { label: 'Клієнти', value: '2' },
                                    { label: 'Додатково', value: '3' },
                                ]}
                            />
                            <TabPanel value='0'>
                                <CustomTextField
                                    label='Назва'
                                    name='title'
                                    value={banner.title ?? ''}
                                    onChange={handleInputChange}
                                    required={true}
                                />
                                <CustomTextField
                                    label='Опис'
                                    name='body'
                                    value={banner.body ?? ''}
                                    onChange={handleInputChange}
                                />
                                <Box className={classes.customBox}>
                                    <Typography variant='body1' className='label'>
                                        Тип банера
                                        <span className={classes.customAsterisk}>*</span>
                                    </Typography>
                                    <Select
                                        className='text'
                                        value={banner.codeTypeBanner ?? ''}
                                        onChange={(e) => handleSingleSelectChange(e, 'codeTypeBanner')}
                                        name='codeTypeBanner'
                                        fullWidth
                                    >
                                        {typeBanners.map((type: BannerType) => (
                                            <MenuItem key={type.codeTypeBanner} value={type.codeTypeBanner}>
                                                {type.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Box>
                                <CustomTextField
                                    label='Група банера'
                                    value={groupBannerDetails.name ?? ''}
                                    onChange={handleInputChange}
                                    disabled={true}
                                    required={true}
                                />
                                {!isFormValid() && (
                                    <Typography color='error' align='center' margin='normal'>
                                        Заповніть всі поля позначені *
                                    </Typography>
                                )}
                                {hasChanges && (
                                    <Box className={classes.actionsContainer}>
                                        <Button variant='contained' onClick={handleSave} disabled={!isFormValid()}>
                                            ЗБЕРЕГТИ
                                        </Button>
                                        <Button variant='contained' onClick={handleCancel}>
                                            СКАСУВАТИ
                                        </Button>
                                    </Box>
                                )}
                            </TabPanel>
                            <TabPanel value='1'>
                                <TextField
                                    fullWidth
                                    label='Запланована дата'
                                    type='datetime-local'
                                    name='plannedDate'
                                    value={banner.plannedDate ?? ''}
                                    onChange={handleInputChange}
                                    margin='normal'
                                    InputLabelProps={{ shrink: true }}
                                />
                            </TabPanel>
                            <TabPanel value='2'>
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
                                        <Box>
                                            <DefaultDataGrid
                                                rows={rows}
                                                columns={columns}
                                                onSelectionModelChange={(newSelectionModel) => setSelectedRows(newSelectionModel)}
                                                checkboxSelection={true}
                                            />
                                        </Box>
                                    </>
                                )}
                            </TabPanel>
                            <TabPanel value='3'>
                                {initialData && (
                                    <CustomTextField
                                        label='Дата створення'
                                        value={banner.dateCreate ?? ''}
                                        disabled={true}
                                    />
                                )}
                                <CustomTextField
                                    label='Код зовнішньої системи'
                                    name='externalId'
                                    value={banner.externalId ?? ''}
                                    onChange={handleInputChange}
                                />
                                <CustomTextField
                                    label='Примітка'
                                    name='note'
                                    value={banner.note ?? ''}
                                    onChange={handleInputChange}
                                />
                                <CustomTextField
                                    label='Результат відправки'
                                    name='sendResult'
                                    value={banner.sendResult ?? ''}
                                    onChange={handleInputChange}
                                />
                                {!initialData && (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={banner.status === 2}
                                                onChange={handleCheckboxChange}
                                            />
                                        }
                                        label='Готово до відправки:'
                                        labelPlacement='start'
                                        className='label'
                                    />
                                )}
                            </TabPanel>
                        </TabContext>
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
};

export default BannerModal;
