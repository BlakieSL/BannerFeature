import React, { FC } from 'react';
import { GridColDef, GridRowParams } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { GroupBanner } from "../../../types";
import { customTable } from "../../standart-element/DynamicElement";
import { quickSearchToolbar } from '../../standart-element/SearchToolbar';

interface GroupBannerDataGridProps {
    groupBanners: GroupBanner[];
    onRowClick: (params: GridRowParams) => void;
    onEditClick?: (event: React.MouseEvent, group: GroupBanner) => void;
    showEditColumn?: boolean;
    onAddNewGroupClick?: () => void;
    onViewAllBannersClick?: () => void;
}

const GroupBannerDataGrid: FC<GroupBannerDataGridProps> = ({
                                                               groupBanners,
                                                               onRowClick,
                                                               onEditClick,
                                                               showEditColumn = true,
                                                               onAddNewGroupClick,
                                                               onViewAllBannersClick
                                                           }) => {
    const baseColumns: GridColDef[] = [
        {
            field: 'codeGroupBanner',
            headerName: 'Код',
            type: "number",
            maxWidth: 75,
            headerAlign: 'left',
            align: 'left',
            disableColumnMenu: true,
        },
        {
            field: 'name',
            headerName: 'Назва',
            type: "string",
            flex: 1,
            headerAlign: 'left',
            align: 'left',
            disableColumnMenu: true,
        },
    ];

    const editColumn: GridColDef = {
        field: 'edit',
        headerName: '',
        maxWidth: 50,
        headerAlign: 'left',
        align: 'left',
        sortable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
            <IconButton onClick={(event) => onEditClick && onEditClick(event, params.row)}>
                <EditIcon />
            </IconButton>
        )
    }

    const columns = showEditColumn ? [editColumn, ...baseColumns] : baseColumns;

    function toolbar() {
        return quickSearchToolbar([
            { func: onAddNewGroupClick, text: 'Нова група', disabled: false },
            { func: onViewAllBannersClick, text: 'Всі новини', disabled: false }
        ]);
    }

    return customTable({
        height: 'calc(100vh - 130px)',
        columns: columns,
        rows: groupBanners,
        toolbar: toolbar,
        loading: false,
        getRowId: (row: GroupBanner) => row.codeGroupBanner,
        onRowClick: onRowClick
    });
}

export default GroupBannerDataGrid;
