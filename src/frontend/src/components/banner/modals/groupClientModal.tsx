import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroupClients } from '../../../actions/groupClientActions';
import { RootState, SimplifiedGroupClientDto } from '../../../types';
import {
    Modal,
    Box,
    Typography,
    Button,
    Checkbox,
    TextField,
} from '@mui/material';
import { TreeView, TreeItem } from '@mui/x-tree-view';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

interface GroupClientModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (selectedGroups: SimplifiedGroupClientDto[]) => void;
}

interface GroupClient {
    codeGroup: number;
    nameGroup: string;
    codeParentGroup: number;
    children: GroupClient[];
}

const GroupClientModal: FC<GroupClientModalProps> = ({ open, onClose, onSave }) => {
    const dispatch = useDispatch();
    const groupClients = useSelector((state: RootState) => state.groupClientReducer.groupClients);
    const [selectedGroups, setSelectedGroups] = useState<SimplifiedGroupClientDto[]>([]);

    useEffect(() => {
        if (open) {
            dispatch(fetchGroupClients());
        }
    }, [dispatch, open]);

    const handleToggle = (group: GroupClient) => {
        const isSelected = selectedGroups.some(g => g.codeGroup === group.codeGroup);
        if (isSelected) {
            setSelectedGroups(prev => prev.filter(g => g.codeGroup !== group.codeGroup));
        } else {
            setSelectedGroups(prev => [...prev, { codeGroup: group.codeGroup, nameGroup: group.nameGroup }]);
        }
    };

    const handleSave = () => {
        onSave(selectedGroups);
        onClose();
    };

    const renderTree = (nodes: GroupClient) => (
        <TreeItem
            key={nodes.codeGroup}
            nodeId={nodes.codeGroup.toString()}
            label={
                <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}>
                    {nodes.children && nodes.children.length > 0 ? (
                        <FolderIcon sx={{ fontSize: 16, color: '#3333cc', marginRight: 1 }} />
                    ) : (
                        <InsertDriveFileIcon sx={{ fontSize: 16, color: '#3333cc', marginRight: 1 }} />
                    )}
                    <Checkbox
                        sx={{ padding: 0, marginRight: 1, '& svg': { fontSize: 16 } }}
                        checked={selectedGroups.some(g => g.codeGroup === nodes.codeGroup)}
                        onChange={() => handleToggle(nodes)}
                    />
                    <Typography sx={{ fontSize: '0.875rem' }}>{nodes.nameGroup}</Typography>
                </Box>
            }
        >
            {nodes.children && nodes.children.length > 0
                ? nodes.children.map((node: GroupClient) => renderTree(node))
                : null}
        </TreeItem>
    );

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                p: 4,
                bgcolor: 'background.paper',
                width: 960,
                height: 754,
                margin: 'auto',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 1,
            }}>
                <Typography variant="h6">Вибір груп клієнтів</Typography>
                <Box sx={{ mt: 2, flexGrow: 1, overflowY: 'auto' }}>
                    {groupClients.length > 0 ? (
                        <TreeView
                            defaultCollapseIcon={<ExpandMoreIcon sx={{ fontSize: 16 }} />}
                            defaultExpandIcon={<ChevronRightIcon sx={{ fontSize: 16 }} />}
                            sx={{ flexGrow: 1, overflowY: 'auto' }}
                        >
                            {groupClients.map((group: GroupClient) => renderTree(group))}
                        </TreeView>
                    ) : (
                        <Typography>Немає даних для відображення.</Typography>
                    )}
                </Box>
                <Box sx={{ mt: 2 }}>
                    <TextField
                        variant="outlined"
                        fullWidth
                        value={selectedGroups.map(g => g.nameGroup).join(', ')}
                        InputProps={{
                            readOnly: true,
                            sx: {
                                height: 100
                            },
                        }}
                    />
                </Box>
                <Box mt={2} display='flex' justifyContent='flex-end' alignItems='center'>
                    <Typography sx={{ marginRight: 2 }}>Вибрано: {selectedGroups.length}</Typography>
                    {selectedGroups.length > 0 && (
                        <Button variant='contained' onClick={handleSave} sx={{ marginRight: 1 }}>
                            Добавить выбранные
                        </Button>
                    )}
                    <Button variant='contained' onClick={onClose}>Закрыть</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default GroupClientModal;
