import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroupClients } from '../../../actions/groupClientActions';
import { RootState } from '../../../types';
import {
    Modal,
    Box,
    Typography,
    List,
    ListItem,
    Checkbox,
    Button,
} from '@mui/material';

interface GroupClientModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (selectedGroups: number[]) => void;
}

interface GroupClient {
    codeGroup: number;
    nameGroup: string;
}

const GroupClientModal: React.FC<GroupClientModalProps> = ({ open, onClose, onSave }) => {
    const dispatch = useDispatch();
    const groupClients = useSelector((state: RootState) => state.groupClientReducer.groupClients);
    const [selectedGroups, setSelectedGroups] = React.useState<number[]>([]);

    useEffect(() => {
        if (open) {
            dispatch(fetchGroupClients());
        }
    }, [dispatch, open]);

    const handleToggle = (groupId: number) => {
        setSelectedGroups(prev =>
            prev.includes(groupId)
                ? prev.filter(id => id !== groupId)
                : [...prev, groupId]
        );
    };

    const handleSave = () => {
        onSave(selectedGroups);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ p: 4, bgcolor: 'background.paper', width: 400, margin: 'auto', mt: '20%' }}>
                <Typography variant="h6">Вибір груп клієнтів</Typography>
                <List>
                    {groupClients.map((group: GroupClient) => {
                        return (
                            <ListItem key={group.codeGroup}>
                                <Checkbox
                                    checked={selectedGroups.includes(group.codeGroup)}
                                    onChange={() => handleToggle(group.codeGroup)}
                                />
                                {group.nameGroup}
                            </ListItem>
                        );
                    })}
                </List>
                <Box mt={2} display="flex" justifyContent="space-between">
                    <Button variant="contained" onClick={handleSave}>Вибрати</Button>
                    <Button variant="outlined" onClick={onClose}>Закрити</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default GroupClientModal;
