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
import classes from '../styles/groupClientModal.module.scss';

interface GroupClientModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (selectedGroups: SimplifiedGroupClientDto[]) => void;
    selectedGroupClients?: SimplifiedGroupClientDto[];  // New prop for pre-selected group clients
}

interface GroupClient {
    codeGroup: number;
    nameGroup: string;
    codeParentGroup: number;
    children: GroupClient[];
}

const GroupClientModal: FC<GroupClientModalProps> = ({ open, onClose, onSave, selectedGroupClients = [] }) => {
    const dispatch = useDispatch();
    const groupClients = useSelector((state: RootState) => state.groupClientReducer.groupClients);
    const [selectedGroups, setSelectedGroups] = useState<SimplifiedGroupClientDto[]>(selectedGroupClients);

    useEffect(() => {
        const fetchData = async () => {
            if (open) {
                dispatch(fetchGroupClients());
                setSelectedGroups(selectedGroupClients);
            }
        };
        fetchData();
    }, [dispatch, open, selectedGroupClients]);

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
                <Box className={classes.treeItemLabel}>
                    {nodes.children && nodes.children.length > 0 ? (
                        <FolderIcon className={classes.folderIcon} />
                    ) : (
                        <InsertDriveFileIcon className={classes.fileIcon} />
                    )}
                    <Checkbox
                        className={classes.checkbox}
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
        <Modal
            open={open}
            onClose={(_, reason) => {
                if (reason !== 'backdropClick') {
                    onClose();
                }
            }}
        >
            <Box className={classes.modalContainer}>
                <Typography variant="h6">Вибір груп клієнтів</Typography>
                <Box className={classes.treeContainer}>
                    {groupClients.length > 0 ? (
                        <TreeView
                            defaultCollapseIcon={<ExpandMoreIcon sx={{ fontSize: 16 }} />}
                            defaultExpandIcon={<ChevronRightIcon sx={{ fontSize: 16 }} />}
                        >
                            {groupClients.map((group: GroupClient) => renderTree(group))}
                        </TreeView>
                    ) : (
                        <Typography>Немає даних для відображення.</Typography>
                    )}
                </Box>
                <Box>
                    <TextField
                        variant="outlined"
                        fullWidth
                        value={selectedGroups.map(g => g.nameGroup).join(', ')}
                        InputProps={{
                            readOnly: true,
                            className: classes.selectedGroupsInput,
                        }}
                    />
                </Box>
                <Box className={classes.actionsContainer}>
                    <Typography>Вибрано: {selectedGroups.length}</Typography>
                    {selectedGroups.length > 0 && (
                        <Button variant='contained' onClick={handleSave}>
                            ДОДАТИ ВИБРАНІ
                        </Button>
                    )}
                    <Button variant='contained' onClick={onClose}>
                        ЗАКРИТИ
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default GroupClientModal;
