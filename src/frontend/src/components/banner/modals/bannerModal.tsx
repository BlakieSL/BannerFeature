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
import {BannerDto, BannerDtoRequest, RootState, SimplifiedClientDto, SimplifiedGroupClientDto} from "../../../types";
import { SelectChangeEvent } from '@mui/material/Select';
import GroupClientModal from "../modals/groupClientModal";
import ClientModal from "./clientsModal";
import { useDispatch, useSelector } from "react-redux";
import { deleteBanner, updateBanner } from "../../../actions/bannerActions";
import ErrorModal from "./errorModal";
import { fetchGroupClient } from "../../../actions/groupClientActions";
import { fetchClient } from "../../../actions/clientActions";

interface BannerModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (banner: BannerDtoRequest) => void;
    initialData: BannerDto | null; // Updated to use BannerDto for initial data
    groupCode: number | null;
    title: string;
}

const BannerModal: FC<BannerModalProps> = ({ open, onClose, onSave, initialData, groupCode, title }) => {
    const dispatch = useDispatch();
    const defaultBanner: BannerDto = {
        codeBanner: 0,
        title: "",
        body: "",
        plannedDate: null,
        status: 2,
        sendResult: "",
        codeTypeBanner: 0,
        externalId: 0,
        note: "",
        codeGroupBanner: 0,
        groupClients: new Set(), // Use SimplifiedGroupClientDto objects
        singleClients: new Set(), // Use SimplifiedClientDto objects
    };

    const [tabIndex, setTabIndex] = useState(0);
    const [isGroupClientModalOpen, setIsGroupClientModalOpen] = useState(false);
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [banner, setBanner] = useState<BannerDto>(initialData || defaultBanner);
    const [error, setError] = useState('');
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

    useEffect(() => {
        setBanner(initialData || defaultBanner);
    }, [initialData, groupCode]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setBanner({ ...banner, [name]: value });
    };

    const handleSingleSelectChange = (event: SelectChangeEvent<number>, key: keyof BannerDto) => {
        const value = event.target.value as number;
        setBanner({ ...banner, [key]: value });
    };

    const convertBannerToRequest = (banner: BannerDto): BannerDtoRequest => {
        return {
            ...banner,
            groupClients: new Set(Array.from(banner.groupClients || []).map(gc => gc.codeGroup)),
            singleClients: new Set(Array.from(banner.singleClients || []).map(sc => sc.codeClient)),
        };
    };

    const handleSave = () => {
        const bannerRequest = convertBannerToRequest(banner);
        onSave(bannerRequest);
    };

    const handleGroupClientsSave = (selectedGroups: SimplifiedGroupClientDto[]) => {
        setBanner((prevBanner) => ({
            ...prevBanner,
            groupClients: new Set([
                ...Array.from(prevBanner.groupClients || []),
                ...selectedGroups
            ])
        }));
    };

    const handleClientsSave = (selectedClients:  SimplifiedClientDto[]) => {
        setBanner((prevBanner) => ({
            ...prevBanner,
            singleClients: new Set([
                ...Array.from(prevBanner.singleClients || []),
                ...selectedClients
            ])
        }));
    };

    const handleDelete = async () => {
        const result = await dispatch(deleteBanner(banner.codeBanner));
        if (typeof result === 'string') {
            setError(result);
            setIsErrorModalOpen(true);
        } else {
            onClose();
        }
    };

    const handleCloseErrorModal = () => {
        setIsErrorModalOpen(false);
    };

    const handleUpdate = async () => {
        const bannerRequest = convertBannerToRequest(banner);
        const result = await dispatch(updateBanner(bannerRequest.codeBanner, bannerRequest));
        if (typeof result === 'string') {
            setError(result);
            setIsErrorModalOpen(true);
        } else {
            onClose();
        }
    };

    const columns: GridColDef[] = [
        {
            field: 'type',
            headerName: 'Тип',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            disableColumnMenu: true,
        },
        {
            field: 'code',
            headerName: 'Код',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            disableColumnMenu: true,
        },
        {
            field: 'title',
            headerName: 'Назва',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
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
                <Box
                    sx={{
                        p: 4,
                        bgcolor: 'background.paper',
                        width: 1280,
                        height: 765,
                        margin: 'auto',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: 24,
                        borderRadius: 1,
                    }}
                >
                    <Typography id="banner-modal-title" variant="h6" component="h2">
                        {title}
                    </Typography>
                    <Box sx={{
                        borderColor: 'divider',
                        border: 0.5,
                        width: 1215,
                        height: 600,
                    }}>
                        <TabContext value={tabIndex.toString()}>
                            <TabList onChange={handleTabChange} aria-label="banner modal tabs">
                                <Tab label="Основні" value="0" />
                                <Tab label="Дата" value="1" />
                                <Tab label="Клієнти" value="2" />
                                <Tab label="Додатково" value="3" />
                            </TabList>
                            <TabPanel value="0">
                                <TextField
                                    fullWidth
                                    label="Назва"
                                    name="title"
                                    value={banner.title}
                                    onChange={handleInputChange}
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Опис"
                                    name="body"
                                    value={banner.body}
                                    onChange={handleInputChange}
                                    margin="normal"
                                />
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Тип банера</InputLabel>
                                    <Select
                                        value={banner.codeTypeBanner}
                                        onChange={(e) => handleSingleSelectChange(e, "codeTypeBanner")}
                                        name="codeTypeBanner"
                                    >
                                        <MenuItem value={1}>Тип 1</MenuItem>
                                        <MenuItem value={2}>Тип 2</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    fullWidth
                                    label="Код групи банерів"
                                    value={banner.codeGroupBanner}
                                    disabled
                                    margin="normal"
                                />
                            </TabPanel>
                            <TabPanel value="1">
                                <TextField
                                    fullWidth
                                    label="Запланована дата"
                                    type="datetime-local"
                                    name="plannedDate"
                                    value={banner.plannedDate || ""}
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
                                    <Box mt={2} sx={{ height: 300 }}>
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
                                <TextField
                                    fullWidth
                                    label="Код зовнішньої системи"
                                    name="externalId"
                                    value={banner.externalId}
                                    onChange={handleInputChange}
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Примітка"
                                    name="note"
                                    value={banner.note}
                                    onChange={handleInputChange}
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Результат відправки"
                                    name="sendResult"
                                    value={banner.sendResult}
                                    onChange={handleInputChange}
                                    margin="normal"
                                />
                            </TabPanel>
                        </TabContext>
                    </Box>

                    <Box
                        sx={{
                            display:"flex",
                            justifyContent:"flex-end",
                            alignItems:"center",
                            position: 'absolute',
                            bottom: 16,
                            right: 16,
                            width: 'calc(100% - 32px)',
                            paddingTop: 2,
                            marginTop: 4,
                        }}
                    >
                        <Button variant="contained" color="primary" onClick={ initialData ? handleUpdate : handleSave}>
                            Зберегти
                        </Button>
                        {initialData && (
                            <Button variant='contained' color='primary' onClick={handleDelete}>
                                Видалити
                            </Button>
                        )}
                        <Button variant="contained" color="primary" onClick={onClose}>
                            Закрити
                        </Button>
                    </Box>

                    <GroupClientModal
                        open={isGroupClientModalOpen}
                        onClose={() => setIsGroupClientModalOpen(false)}
                        onSave={handleGroupClientsSave}
                    />
                    <ClientModal
                        open={isClientModalOpen}
                        onClose={() => setIsClientModalOpen(false)}
                        onSave={handleClientsSave}
                    />
                </Box>
            </Modal>
            <ErrorModal open={isErrorModalOpen} onClose={handleCloseErrorModal} errorMessage={error}/>
        </>
    );
};

export default BannerModal;
