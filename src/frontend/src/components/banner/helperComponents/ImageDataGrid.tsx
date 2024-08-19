import React from 'react';
import { Box } from '@mui/material';
import { GridColDef, GridRowParams } from '@mui/x-data-grid';
import { customTable } from '../../standart-element/DynamicElement';
import {quickSearchToolbar} from "../../standart-element/SearchToolbar";

interface ImageDataGridProps {
    height: string;
    images: any[];
    onAddNewImageClick?: () => void;
    showButtons?: boolean;
    disableButton?: boolean;
    onSelectionChange?: (selection: Array<any>) => void;
    checkboxSelection?: boolean
}

const ImageDataGrid: React.FC<ImageDataGridProps> = ({
                                                         images,
                                                         height,
                                                         onAddNewImageClick,
                                                         showButtons = true,
                                                         disableButton = false,
                                                         onSelectionChange,
                                                         checkboxSelection
                                                     }) => {

    const handleRowClick = (params: GridRowParams) => {
        const imageUrl = `data:image/jpeg;base64,${params.row.image}`;
        window.open(imageUrl, '_blank');
    };

    const columns: GridColDef[] = [
        {
            field: 'codeImage',
            headerName: 'Код',
            type: 'number',
            maxWidth: 75,
            disableColumnMenu: true,
            headerAlign: 'left',
            align: 'left'
        },
        {
            field: 'image',
            headerName: 'Фото',
            flex: 1,
            disableColumnMenu: true,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Box
                    component="img"
                    src={`data:image/jpeg;base64,${params.row.image}`}
                    alt="banner"
                    sx={{ width: '100px'}}
                />
            )
        }
    ];

    function toolbar() {
        return quickSearchToolbar(showButtons
            ? [
                { func: onAddNewImageClick, text: 'Вибір зображення', disabled: disableButton },
            ]
            : []
        );
    }

    return customTable({
        height: height,
        rowHeight: 100,
        columns: columns,
        rows: images,
        loading: false,
        toolbar: toolbar,
        getRowId: (row : any) => row.codeImage,
        onRowClick: handleRowClick,
        onSelectionChange: onSelectionChange,
        checkboxSelection: checkboxSelection
    })
};

export default ImageDataGrid;
