import React, { FC } from "react";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { GroupBanner } from "../../../types";
import DefaultDataGrid from "./DefaultDataGrid";

interface GroupBannerDataGridProps {
    groupBanners: GroupBanner[];
    onRowClick: (params: GridRowParams) => void;
    onEditClick?: (event: React.MouseEvent, group: GroupBanner) => void;
    showEditColumn?: boolean;
}

const GroupBannerDataGrid: FC<GroupBannerDataGridProps> = ({ groupBanners, onRowClick, onEditClick, showEditColumn = true }) => {
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
    };

    const columns = showEditColumn ? [editColumn, ...baseColumns] : baseColumns;

    return (
        <DefaultDataGrid
            rows={groupBanners}
            columns={columns}
            getRowId={(row) => row.codeGroupBanner}
            onRowClick={onRowClick}
        />
    );
};

export default GroupBannerDataGrid;
