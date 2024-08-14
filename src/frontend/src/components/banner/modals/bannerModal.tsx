import React, { FC, useEffect, useState } from 'react';
import {
    Button,
    TextField,
    Box,
    Typography,
    Select,
    FormControl,
    InputLabel,
    Modal,
    Tab,
    MenuItem,
} from "@mui/material";
import {
    TabPanel,
    TabContext,
    TabList,
} from "@mui/lab/";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
    BannerDto,
    BannerDtoRequest,
    BannerType, GroupBanner,
    RootState,
    SimplifiedClientDto,
    SimplifiedGroupClientDto
} from "../../../types";
import { SelectChangeEvent } from '@mui/material/Select';
import GroupClientModal from "../modals/groupClientModal";
import ClientModal from "./clientsModal";
import { useDispatch, useSelector } from "react-redux";
import {
    copyBanner,
    createBanner,
    deleteBanner,
    fetchBannersByGroup, moveBanner,
    updateBanner
} from "../../../actions/bannerActions";
import ErrorModal from "./errorModal";
import StyledTabList from "../helperComponents/StyledTabList";
import classes from '../styles/bannerModal.module.scss';
import {fetchTypeBanners} from "../../../actions/typeBannerActions";
import CustomTextField from "../helperComponents/CustomTextField";
import SelectGroupBannerModal from "./selectGroupBannerModal";
import ConfirmDialog from "./confirmModal";
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

    const initialBannerState: BannerDto = {
        codeGroupBanner: groupBannerDetails.codeGroupBanner,
    };
    const [banner, setBanner] = useState<BannerDto>(initialData || initialBannerState);

    useEffect(() => {
        const fetchData = async () => {
            if (initialData) {
                setBanner(initialData);
            } else {
                setBanner(initialBannerState);
            }
            await dispatch(fetchTypeBanners())
        };
        fetchData();
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
        setBanner({ ...banner, [key]: value || undefined });;
        setHasChanges(true);
    };

    const convertBannerToRequest = (banner: BannerDto): BannerDtoRequest => {
        if (!banner.title || !banner.codeTypeBanner) {
            throw new Error("Required fields are missing");
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
        if (banner.externalId !== undefined) bannerRequest.externalId = banner.externalId;
        if (banner.note) bannerRequest.note = banner.note;

        if (banner.groupClients && banner.groupClients.size > 0) {
            bannerRequest.groupClients = Array.from(banner.groupClients).map(gc => gc.codeGroup);
        }
        if (banner.singleClients && banner.singleClients.size > 0) {
            bannerRequest.singleClients = Array.from(banner.singleClients).map(sc => sc.codeClient);
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

    const handleClientsSave = (selectedClients:  SimplifiedClientDto[]) => {
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
                await dispatch(updateBanner(bannerRequest.codeBanner, bannerRequest));
            } else {
                await dispatch(createBanner(bannerRequest));
            }
            onClose();
        } catch (error : any) {
            setError(error.response.data || 'Error saving banner');
            setIsErrorModalOpen(true);
        }
    };

    const handleDelete = async () => {
        try {
            if (banner.codeBanner) {
                await dispatch(deleteBanner(banner.codeBanner));
                onClose();
            }
        } catch (error : any) {
            setError(error.response.data || 'Error deleting banner');
            setIsErrorModalOpen(true);
        }
    };

    const handleCloseErrorModal = () => {
        setIsErrorModalOpen(false);
    };

    const handleCancel = () => {
        if(initialData) {
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

    const handleConfirmAction = async () => {
        try{
            if (selectedGroup && actionType) {
                if (actionType === 'copy') {
                    await dispatch(copyBanner(banner.codeBanner, selectedGroup.codeGroupBanner));
                } else if (actionType === 'move') {
                    await dispatch(moveBanner(banner.codeBanner, selectedGroup.codeGroupBanner));
                }
            }
        } catch (error : any) {
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
                disableEnforceFocus={true}
            >
                <Box className={classes.modalContainer}>
                    <Typography id="banner-modal-title" variant="h6" component="h2">
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
                            <TabPanel value="0">
                                <CustomTextField
                                    label="Назва"
                                    name="title"
                                    value={banner.title ?? ""}
                                    onChange={handleInputChange}
                                    required={true}
                                />
                                <CustomTextField
                                    label="Опис"
                                    name="body"
                                    value={banner.body ?? ""}
                                    onChange={handleInputChange}
                                />
                                <Box className={classes.customBox}>
                                    <Typography variant="body1" className={classes.customTypography}>
                                        Тип банера
                                        <span className={classes.customAsterisk}>*</span>
                                    </Typography>
                                    <Select
                                        value={banner.codeTypeBanner ?? ""}
                                        onChange={(e) => handleSingleSelectChange(e, "codeTypeBanner")}
                                        name="codeTypeBanner"
                                    >
                                        {typeBanners.map((type: BannerType) => (
                                            <MenuItem key={type.codeTypeBanner} value={type.codeTypeBanner}>
                                                {type.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Box>
                                <CustomTextField
                                    label="Група банера"
                                    value={groupBannerDetails.name ?? ""}
                                    onChange={handleInputChange}
                                    disabled={true}
                                    required={true}
                                />
                                {!isFormValid() && (
                                    <Typography color="error" align="center" margin="normal">
                                        Заповніть всі поля позначені *
                                    </Typography>
                                )}
                                {hasChanges && (
                                    <Box className={classes.contentActions}>
                                        <Button variant='contained' onClick={handleSave} disabled={!isFormValid()}>
                                            ЗБЕРЕГТИ
                                        </Button>
                                        <Button variant='contained' onClick={handleCancel}>
                                            СКАСУВАТИ
                                        </Button>
                                    </Box>
                                )}
                            </TabPanel>
                            <TabPanel value="1">
                                <TextField
                                    fullWidth
                                    label="Запланована дата"
                                    type="datetime-local"
                                    name="plannedDate"
                                    value={banner.plannedDate ?? ""}
                                    onChange={handleInputChange}
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                />
                            </TabPanel>
                            <TabPanel value="2">
                                <Button variant="contained" onClick={() => setIsGroupClientModalOpen(true)}>
                                    Вибір груп
                                </Button>
                                <Button variant="contained" onClick={() => setIsClientModalOpen(true)}>
                                    Вибір клієнтів
                                </Button>
                                {rows.length > 0 && (
                                    <Box className={classes.dataGridContainer}>
                                        <DataGrid
                                            rows={rows}
                                            columns={columns}
                                            pageSizeOptions={[5, 10]}
                                            initialState={{
                                                pagination: {
                                                    paginationModel: { pageSize: 5 },
                                                },
                                            }}
                                        />
                                    </Box>
                                )}
                            </TabPanel>
                            <TabPanel value="3">
                                <CustomTextField
                                    label="Код зовнішньої системи"
                                    name="externalId"
                                    value={banner.externalId ?? ""}
                                    onChange={handleInputChange}
                                />
                                <CustomTextField
                                    label="Примітка"
                                    name="note"
                                    value={banner.note ?? ""}
                                    onChange={handleInputChange}
                                />
                                <CustomTextField
                                    label="Результат відправки"
                                    name="sendResult"
                                    value={banner.sendResult ?? ""}
                                    onChange={handleInputChange}
                                />
                            </TabPanel>
                        </TabContext>
                    </Box>
                    <Box className={classes.footerActions}>
                        {initialData && (
                            <>
                                <Button variant="contained" onClick={() => handleOpenSelectGroupModal('copy')}>
                                    ДУБЛЮВАТИ
                                </Button>
                                <Button variant="contained" onClick={() => handleOpenSelectGroupModal('move')}>
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
                    `Копіювати новину ${banner.codeBanner} "${banner.title}" у папку ${selectedGroup?.codeGroupBanner} "${selectedGroup?.name}"?` :
                    `Переместить новину ${banner.codeBanner} "${banner.title}" у папку ${selectedGroup?.codeGroupBanner} "${selectedGroup?.name}"?`}
            />
        </>
    );
};

export default BannerModal;
