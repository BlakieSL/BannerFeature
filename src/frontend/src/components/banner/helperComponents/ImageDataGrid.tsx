import React from 'react';
import { Box } from '@mui/material';
import {GridColDef, GridColumnVisibilityModel, GridRowParams} from '@mui/x-data-grid';
import { customTable } from '../../standart-element/DynamicElement';
import {quickSearchToolbar} from "../../standart-element/SearchToolbar";

interface ImageDataGridProps {
    height: string;
    images: {
        codeImage: number;
        codeValue?: number;
        image: string;
        width: number;
        height: number;
        fileSize: number;
    }[];
    onAddNewImageClick?: () => void;
    showButtons?: boolean;
    disableButton?: boolean;
    onSelectionChange?: (selection: Array<any>) => void;
    checkboxSelection?: boolean;
    displayBannerCode?: boolean;
}

const ImageDataGrid: React.FC<ImageDataGridProps> = ({
                                                         images,
                                                         height,
                                                         onAddNewImageClick,
                                                         showButtons = true,
                                                         disableButton = false,
                                                         onSelectionChange,
                                                         checkboxSelection,
                                                         displayBannerCode = true,
                                                     }) => {

    const handleImageClick = (imageBase64: string) => {
        const imageUrl = `data:image/jpeg;base64,${imageBase64}`;
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
            align: 'left',
            renderCell: (params) => (
                params.row.codeImage !== undefined
                    ? params.row.codeImage
                    : '-'
            ),
        },
        {
            field: 'codeValue',
            headerName: 'Код банера',
            type: 'number',
            maxWidth: 75,
            disableColumnMenu: true,
            headerAlign: 'left',
            align: 'left',
            renderCell: (params) => (
                params.row.codeValue !== undefined
                    ? params.row.codeValue
                    : '-'
            ),
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
                    sx={{ width: '80px', cursor: 'pointer' }}
                    onClick={() => handleImageClick(params.row.image)}
                />
            )
        },
        {
            field: 'imageSizePixels',
            headerName: 'Розмір (пікселі)',
            flex: 1,
            disableColumnMenu: true,
            headerAlign: 'left',
            align: 'left',
            renderCell: (params) => {
                return params.row.width && params.row.height
                    ? `${params.row.width} x ${params.row.height}`
                    : 'Невідомо';
            }
        },
        {
            field: 'imageFileSize',
            headerName: 'Розмір файлу (KB)',
            flex: 1,
            disableColumnMenu: true,
            headerAlign: 'left',
            align: 'left',
            renderCell: (params) => {
                return params.row.fileSize
                    ? `${(params.row.fileSize / 1024).toFixed(2)} kb`
                    : '0';
            }
        }
    ];

    const columnVisibilityModel: GridColumnVisibilityModel = {
        codeImage: true,
        codeValue: displayBannerCode,
        image: true,
        imageSizePixels: true,
        imageFileSize: true,
    };
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
        rowHeight: 80,
        columns: columns,
        rows: images,
        loading: false,
        toolbar: toolbar,
        getRowId: (row : any) => row.codeImage,
        onSelectionChange: onSelectionChange,
        checkboxSelection: checkboxSelection,
        columnVisibilityModel: columnVisibilityModel
    })
};

export default ImageDataGrid;
