import React, { FC } from 'react';
import { DataGrid, GridRowParams, GridRowSelectionModel, DataGridProps } from '@mui/x-data-grid';

interface DefaultDataGridProps extends DataGridProps {
    onRowClick?: (params: any) => void;
    getRowId?: (row: any) => any;
    onSelectionModelChange?: (newSelectionModel: GridRowSelectionModel) => void;
    checkboxSelection?: boolean;
}

const DefaultDataGrid: FC<DefaultDataGridProps> = ({
                                                       rows,
                                                       columns,
                                                       getRowId,
                                                       onRowClick,
                                                       onSelectionModelChange,
                                                       checkboxSelection = false,
                                                       ...dataGridProps
                                                   }) => {
    const getRowClassName = (params: GridRowParams) => {
        if (params.row.status === 3) {
            return 'row-completed';
        } else if (params.row.status === 2) {
            return 'row-ready';
        }
        return '';
    };

    return (
        <DataGrid
            rows={rows}
            columns={columns}
            getRowId={getRowId}
            getRowClassName={getRowClassName}
            onRowClick={onRowClick}
            onRowSelectionModelChange={onSelectionModelChange}
            checkboxSelection={checkboxSelection}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50, 100, 200]}
            initialState={{
                pagination: {
                    paginationModel: { pageSize: 50 }
                }
            }}
            { ...dataGridProps}
            sx={{
                '& .MuiDataGrid-virtualScroller': {
                    height: rows.length === 0 ? '0px' : 'auto',
                },
                '& .MuiDataGrid-overlay': {
                    display: rows.length === 0 ? 'none' : 'block',
                },
                '& .MuiDataGrid-row.Mui-selected': {
                    backgroundColor: '#ffebf2',
                    '&:hover': {
                        backgroundColor: '#ffdbe1',
                    },
                },
            }}
        />
    );
};

export default DefaultDataGrid;
