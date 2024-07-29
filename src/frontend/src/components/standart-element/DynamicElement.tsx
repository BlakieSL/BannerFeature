import React from 'react';
import {Box, createTheme, ThemeProvider} from '@mui/material';
import {styled} from "@mui/material/styles";
import {DataGrid, GridRowParams, GridCellParams, ukUA} from "@mui/x-data-grid";
import {ukUA as coreUkUA} from "@mui/material/locale";
import {ukUA as pickersUkUA} from "@mui/x-date-pickers/locales/ukUA";

interface CustomTableParams {
    height: string;
    columns: Array<any>;
    rows: Array<any>;
    rowId?: any;
    toolbar: any;
    onRowDoubleClick?: any;
    loading?: boolean;
    getRowId?: any;
    checkboxSelection?: boolean
    onSelectionChange?: (selection: Array<any>) => void;
    getRowClassName?: (params: GridRowParams) => string;
    getCellClassName?: (params: GridCellParams) => string;
}

const StyledDataGrid = styled(DataGrid)(({theme}) => ({
    '& .MuiDataGrid-columnHeaderTitle': {
        whiteSpace: 'break-spaces',
        lineHeight: 1,
    },
    '&.MuiDataGrid-root .MuiDataGrid-columnHeader--alignRight .MuiDataGrid-columnHeaderTitleContainer': {
        pl: 1,
    },
    '& .theme--error': {
        backgroundColor: '#ffcece',
        '&:hover': {
            backgroundColor: '#ff9e9e',
        },
        '&.Mui-selected': {
            backgroundColor: '#ff9e9e',

            '&:hover': {
                backgroundColor: '#ff9e9e',

            },
        },
    },
    '& .theme--active': {
        backgroundColor: '#ceffd6',
        '&:hover': {
            backgroundColor: '#9bffab',
        },
        '&.Mui-selected': {
            backgroundColor: '#9bffab',
            '&:hover': {
                backgroundColor: '#9bffab',
            },
        },
    }
}));

const customTable = (params: CustomTableParams) => {
    const theme = createTheme(
        {
            palette: {
                primary: {main: '#3f51b5'},
            },
        },
        ukUA,
        coreUkUA,
        pickersUkUA
    );

    const getRowId = (row: any) => {
        return params.getRowId === undefined ? row[params.rowId] : params.getRowId(row)
    }

    const handleSelectionChange = (selectionModel: Array<any>) => {
        if (params.onSelectionChange) params.onSelectionChange(selectionModel);
    };

    return <div
        style={{
            height: params.height,
            width: '100%',
            overflow: 'hidden'
        }}> {/* Используем абсолютное значение высоты */}
        <Box sx={{height: '100%'}}>
            <ThemeProvider theme={theme}>
                <StyledDataGrid
                    sx={{overflowX: 'auto'}}
                    density={"compact"}
                    columns={params.columns}
                    rows={params.rows}
                    getRowId={getRowId}
                    pageSizeOptions={[100]}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 100
                            }
                        },
                        filter: {
                            filterModel: {
                                items: [],
                            },
                        },
                    }}
                    slots={{toolbar: params.toolbar}}
                    slotProps={{
                        toolbar: {
                            showQuickFilter: true,
                            quickFilterProps: {
                                debounceMs: 500,
                            },
                        },
                    }}
                    onRowDoubleClick={params.onRowDoubleClick}

                    loading={params.loading}
                    disableColumnFilter
                    disableColumnMenu
                    //disableVirtualization
                    //hideFooterPagination
                    disableColumnSelector
                    disableDensitySelector
                    checkboxSelection={params.checkboxSelection}
                    onRowSelectionModelChange={handleSelectionChange}
                    getRowClassName={params.getRowClassName}
                    getCellClassName={params.getCellClassName}
                />
            </ThemeProvider>
        </Box>
    </div>
}


export {
    customTable
};