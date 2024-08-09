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
    List,
    ListItem,
    Checkbox,
} from '@mui/material';

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

    useEffect(() => {
        console.log('Clients updated in component:', clients);  // Add this line for debugging
    }, [clients]);
    const handleSearch = () => {
        console.log('Search type:', searchType);
        console.log('Search query:', searchQuery);

        if (searchType === 'phone') {
            // Create the DTO and dispatch the action for finding by phone
            const dto = { phone: searchQuery };
            console.log('Dispatching findClientByPhone with DTO:', dto);
            dispatch(findClientByPhone(dto));
        } else {
            // Create the DTO and dispatch the action for finding by barcodes
            const dto = { barcodes: searchQuery };
            console.log('Dispatching findClientsByBarcodes with DTO:', dto);
            dispatch(findClientsByBarcodes(dto));
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

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ p: 4, bgcolor: 'background.paper', width: 600, margin: 'auto', mt: '20%' }}>
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
                <List>
                    {clients.map((client: Client) => (
                        <ListItem key={client.codeClient}>
                            <Checkbox
                                checked={selectedClients.includes(client.codeClient)}
                                onChange={() => handleToggle(client.codeClient)}
                            />
                            {client.surname}
                        </ListItem>
                    ))}
                </List>
                <Box mt={2} display="flex" justifyContent="space-between">
                    <Button variant="contained" onClick={handleSave}>Додати вибрані</Button>
                    <Button variant="outlined" onClick={onClose}>Закрити</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ClientModal;
