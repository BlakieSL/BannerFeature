import React, { useState } from 'react';
import {
    Button,
    TextField,
    Box,
    Typography,
    Select,
    FormControl,
    InputLabel,
    Modal,
    Tab, MenuItem,
} from "@mui/material";
import {
    TabPanel,
    TabContext,
    TabList,
} from "@mui/lab/";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { BannerDtoRequest } from "../../../types";
import { SelectChangeEvent } from '@mui/material/Select';
import GroupClientModal from "../modals/groupClientModal";
import ClientModal from "./clientsModal";

interface BannerModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (banner: BannerDtoRequest) => void;
    initialData?: BannerDtoRequest;
    groupCode: number;
    title: string;
}

const BannerModal: React.FC<BannerModalProps> = ({open, onClose, onSave, initialData, groupCode, title }) => {
    const [tabIndex, setTabIndex] = useState(0);
    const [isGroupClientModalOpen, setIsGroupClientModalOpen] = useState(false);
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [banner, setBanner] = useState<BannerDtoRequest>(
        initialData || {
            title: "",
            body: "",
            plannedDate: null,
            status: 2,
            sendResult: "",
            codeTypeBanner: 0,
            externalId: 0,
            note: "",
            codeGroupBanner: groupCode,
            groupClients: new Set<number>(),
            singleClients: new Set<number>(),
        }
    );

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setBanner({ ...banner, [name]: value });
    };

    const handleSingleSelectChange = (event: SelectChangeEvent<number>, key: keyof BannerDtoRequest) => {
        const value = event.target.value as number;
        setBanner({ ...banner, [key]: value });
    };

    const handleSave = () => {
        onSave(banner);
    };

    const handleGroupClientsSave = (selectedGroups: number[]) => {
        setBanner({ ...banner, groupClients: new Set(selectedGroups) });
    };

    const handleClientsSave = (selectedClients: number[]) => {
        setBanner({ ...banner, singleClients: new Set(selectedClients) });
    };

    const columns: GridColDef[] = [
        {
            field: 'type',
            headerName: 'Тип',
            flex: 1,
            headerAlign: "center",
            align: "center",
            disableColumnMenu: true,
        },
        {
            field: 'code',
            headerName: 'Код',
            flex: 1,
            headerAlign: "center",
            align: "center",
            disableColumnMenu: true,
        },
        {
            field: 'name',
            headerName: 'Назва',
            flex: 2,
            headerAlign: "center",
            align: "center",
            disableColumnMenu: true,
        },
    ];

    const rows = [
        ...Array.from(banner.groupClients ?? []).map(groupId => ({
            id: `group-${groupId}`,
            type: 'Группа клієнтів',
            code: groupId,
            name: `Group Name for ID ${groupId}`, // Replace with actual group name
        })),
        ...Array.from(banner.singleClients ?? []).map(clientId => ({
            id: `client-${clientId}`,
            type: 'Клієнт',
            code: clientId,
            name: `Client Name for ID ${clientId}`, // Replace with actual client name
        })),
    ];

    return (
        <Modal
            open={open}
            onClose={(_, reason) => {
                if (reason !== 'backdropClick') {
                    onClose();
                }
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 800,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography id="banner-modal-title" variant="h6" component="h2">
                    {title}
                </Typography>
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
                            Вибір груп клієнтів
                        </Button>
                        <Button variant="contained" onClick={() => setIsClientModalOpen(true)}>
                            Вибір клієнтів
                        </Button>
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

                    <Box display="flex" justifyContent="flex-end" marginTop={2}>
                        <Button variant="contained" color="primary" onClick={handleSave}>
                            Зберегти
                        </Button>
                        <Button variant="outlined" color="primary" onClick={onClose}>
                            Закрити
                        </Button>
                    </Box>
                </TabContext>

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
    );
};

export default BannerModal;
