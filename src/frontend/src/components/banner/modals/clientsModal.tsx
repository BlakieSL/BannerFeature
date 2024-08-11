import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { findClientByPhone, findClientsByBarcodes } from '../../../actions/clientActions';
import { RootState } from '../../../types';
import {
    Modal,
    Box,
    Typography,
    Button,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Checkbox,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface ClientSearchModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (selectedClients: number[]) => void;
}

interface Client {
    codeClient: number;
    surname: string;
}

const ClientModal: React.FC<ClientSearchModalProps> = ({ open, onClose, onSave }) => {
    const dispatch = useDispatch();
    const clients = useSelector((state: RootState) => state.clientReducer.clients);
    const [searchType, setSearchType] = useState<'barcode' | 'phone'>('barcode');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClients, setSelectedClients] = useState<number[]>([]);

    useEffect(() => {
        if (open) {
            setSearchQuery('');
            setSelectedClients([]);
        }
    }, [open]);

    const handleSearch = () => {
        if (searchType === 'phone') {
            dispatch(findClientByPhone({ phone: searchQuery }));
        } else {
            dispatch(findClientsByBarcodes({ barcodes: searchQuery }));
        }
    };

    const handleToggle = (clientId: number) => {
        setSelectedClients(prev =>
            prev.includes(clientId)
                ? prev.filter(id => id !== clientId)
                : [...prev, clientId]
        );
    };

    const handleSave = () => {
        onSave(selectedClients);
        onClose();
    };

    const columns: GridColDef[] = [
        {
            field: 'selected',
            headerName: 'Обраний',
            type: 'boolean',
            width: 150,
            align: "center",
            headerAlign: "center",
            renderCell: (params) => (
                <Checkbox
                    checked={selectedClients.includes(params.row.codeClient)}
                    onChange={() => handleToggle(params.row.codeClient)}
                />
            )
        },
        {
            field: 'codeClient',
            headerName: 'Код',
            flex: 1,
            headerAlign: "center",
            align: "center",
            disableColumnMenu: true,
        },
        {
            field: 'surname',
            headerName: 'Прізвище',
            flex: 2,
            headerAlign: "center",
            align: "center",
            disableColumnMenu: true,
        },
    ];

    const rows = clients.map((client: Client) => ({
        id: client.codeClient,
        ...client,
        selected: selectedClients.includes(client.codeClient),
    }));

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ p: 4, bgcolor: 'background.paper', width: 800, margin: 'auto', mt: '20%' }}>
                <Typography variant="h6">Пошук клієнтів</Typography>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Умова пошуку</InputLabel>
                    <Select
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value as 'barcode' | 'phone')}
                    >
                        <MenuItem value="barcode">Штрихкод (или список через запятую)</MenuItem>
                        <MenuItem value="phone">Номер телефона</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    label={searchType === 'phone' ? 'Номер телефона' : 'Штрихкод'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    margin="normal"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button variant="contained" color="primary" onClick={handleSearch}>
                    Пошук
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
                <Box mt={2} display="flex" justifyContent="space-between">
                    <Button variant="contained" onClick={handleSave}>Додати вибрані</Button>
                    <Button variant="outlined" onClick={onClose}>Закрити</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ClientModal;
