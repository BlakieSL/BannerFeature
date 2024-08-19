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
}

const ImageDataGrid: React.FC<ImageDataGridProps> = ({
                                                         images,
                                                         height,
                                                         onAddNewImageClick,
                                                         showButtons = true,
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
                    sx={{ width: '130px'}}
                />
            )
        }
    ];

    function toolbar() {
        return quickSearchToolbar(showButtons
            ? [
                { func: onAddNewImageClick, text: 'Вибір зображення', disabled: false },
            ]
            : []
        );
    }

    return customTable({
        height: height,
        columns: columns,
        rows: images,
        loading: false,
        toolbar: toolbar,
        getRowId: (row : any) => row.codeImage,
        onRowClick: handleRowClick,
        rowHeight: 130
    })
};

export default ImageDataGrid;
