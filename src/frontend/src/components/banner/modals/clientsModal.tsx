import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {clearClients, findClientByPhone, findClientsByBarcodes} from '../../../actions/clientActions';
import { RootState, SimplifiedClientDto } from '../../../types';
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
import classes from '../styles/clientModal.module.scss';

interface ClientSearchModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (selectedClients: SimplifiedClientDto[]) => void;
}

const ClientModal: React.FC<ClientSearchModalProps> = ({ open, onClose, onSave }) => {
    const dispatch = useDispatch();
    const clients = useSelector((state: RootState) => state.clientReducer.clients);
    const [searchType, setSearchType] = useState<'barcode' | 'phone'>('barcode');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClients, setSelectedClients] = useState<SimplifiedClientDto[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (open) {
                dispatch(clearClients());
                setSearchQuery('');
                setSelectedClients([]);
            }
        };
        fetchData();
    }, [open]);

    const handleSearch = async () => {
        if (searchType === 'phone') {
            await dispatch(findClientByPhone({ phone: searchQuery }));
        } else {
            await dispatch(findClientsByBarcodes({ barcodes: searchQuery }));
        }
    };

    const handleToggle = (client: SimplifiedClientDto) => {
        setSelectedClients(prev =>
            prev.some(selected => selected.codeClient === client.codeClient)
                ? prev.filter(selected => selected.codeClient !== client.codeClient)
                : [...prev, client]
        );
    };

    const handleSave = () => {
        onSave(selectedClients);
        onClose();
    };

    const columns: GridColDef[] = [
        {
            field: 'selected',
            headerName: '',
            type: 'boolean',
            maxWidth: 50,
            align: "center",
            headerAlign: "center",
            renderCell: (params) => (
                <Checkbox
                    checked={selectedClients.some(client => client.codeClient === params.row.codeClient)}
                    onChange={() => handleToggle(params.row)}
                />
            )
        },
        {
            field: 'codeClient',
            headerName: 'Код',
            maxWidth: 125,
            headerAlign: "left",
            align: "left",
            disableColumnMenu: true,
        },
        {
            field: 'surname',
            headerName: 'Назва',
            type: "string",
            flex: 1,
            headerAlign: "left",
            align: "left",
            disableColumnMenu: true,
        },
        {
            field: 'phone',
            headerName: 'Телефон',
            type: "string",
            flex: 1,
            headerAlign: "left",
            align: "left",
            disableColumnMenu: true,
        }
    ];

    const rows = clients.map((client: SimplifiedClientDto) => ({
        id: client.codeClient,
        ...client,
        selected: selectedClients.some(selected => selected.codeClient === client.codeClient),
    }));

    return (
        <Modal open={open} onClose={onClose}>
            <Box className={classes.modalContainer}>
                <Typography variant="h6">Пошук клієнтів</Typography>
                <Box className={classes.searchContainer}>
                    <FormControl>
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
                        className={classes.textField}
                        label={searchType === 'phone' ? 'Условие поиска' : 'Штрихкод'}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button variant="contained" color="primary" onClick={handleSearch}>
                        Поиск
                    </Button>
                </Box>
                <Box className={classes.dataGridContainer}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        hideFooterPagination
                        hideFooter
                    />
                </Box>
                <Box className={classes.actionsContainer}>
                    <Button variant="contained" onClick={handleSave} className={classes.button}>Додати вибрані</Button>
                    <Button variant="contained" onClick={onClose} className={classes.button}>Закрити</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ClientModal;
