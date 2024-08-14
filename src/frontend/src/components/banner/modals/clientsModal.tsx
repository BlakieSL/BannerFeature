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
import {DataGrid, GridColDef, GridRowSelectionModel} from '@mui/x-data-grid';
import classes from '../styles/clientModal.module.scss';
import DefaultDataGrid from "../helperComponents/DefaultDataGrid";

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
    const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (open) {
                dispatch(clearClients());
                setSearchQuery('');
                setSelectedRows([]);
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

    const handleSave = () => {
        const selectedClients = clients.filter((client : SimplifiedClientDto ) =>
            selectedRows.includes(client.codeClient)
        );
        onSave(selectedClients);
        onClose();
    };
    const columns: GridColDef[] = [
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

    return (
        <Modal
            open={open}
            onClose={(_, reason) => {
                if (reason !== 'backdropClick') {
                    onClose();
                }
            }}
        >
            <Box className={classes.modalContainer}>
                <Typography variant="h6">Пошук клієнтів</Typography>
                <Box className={classes.searchContainer}>
                    <FormControl>
                        <Select
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value as 'barcode' | 'phone')}
                        >
                            <MenuItem value="barcode">Штрихкод (aбо список через кому)</MenuItem>
                            <MenuItem value="phone">Номер телефона</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        className={classes.textField}
                        label={searchType === 'phone' ? 'Номер' : 'Штрихкод'}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button variant="contained" onClick={handleSearch}>
                        ПОШУК
                    </Button>
                </Box>
                <Box className={classes.dataGridContainer}>
                    <DefaultDataGrid
                        rows={clients}
                        columns={columns}
                        getRowId={(row) => row.codeClient}
                        onSelectionModelChange={(newSelection) => setSelectedRows(newSelection)}
                        checkboxSelection={true}
                        hideFooterPagination
                        hideFooter
                    />
                </Box>
                <Box className={classes.actionsContainer}>
                    {selectedRows.length > 0 &&(
                        <Button variant="contained" onClick={handleSave} className={classes.button}>
                            ДОДАТИ ВИБРАНІ
                        </Button>
                    )}
                    <Button variant="contained" onClick={onClose} className={classes.button}>
                        ЗАКРИТИ
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ClientModal;
