import React from 'react';
import { TabContext, TabPanel } from '@mui/lab/';
import { Button, Box, Typography, TextField, IconButton } from '@mui/material';
import DeleteIcon from '@material-ui/icons/Delete';
import CustomTextField from '../helperComponents/CustomTextField';
import CustomSelectField from '../helperComponents/CustomSelectField';
import StyledTabList from '../helperComponents/StyledTabList';
import { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import {BannerDto, BannerType, GroupBanner} from '../../../types';
import classes from '../styles/bannerModal.module.scss';
import {customTable} from "../../standart-element/DynamicElement";
import ImageList from "../image/imageList";
import ImageDataGrid from "./ImageDataGrid";

interface BannerTabContentProps {
    tabIndex: number;
    banner: BannerDto;
    handleTabChange: (event: React.SyntheticEvent, newValue: number) => void;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSingleSelectChange: (event: any, key: keyof BannerDto) => void;
    isFormValid: () => boolean;
    hasChanges: boolean;
    handleSave: () => void;
    handleCancel: () => void;
    columns: GridColDef[];
    rows: any[];
    selectedRows: GridRowSelectionModel;
    handleRemoveSelectedClients: () => void;
    toolbar: () => JSX.Element | null;
    channels: { shortValue: string; description: string }[];
    statuses: { shortValue: string; description: string }[];
    typeBanners: BannerType[];
    groupBannerDetails: GroupBanner;
    setSelectedRows: (newSelectionModel: GridRowSelectionModel) => void;
    initialData?: BannerDto;
    images: any[];
    onAddNewImageClick: () => void;
    onSelectionChange?: (selection: Array<any>) => void;
    selectedImages: GridRowSelectionModel;
    handleDeleteSelectedImage: () => void;
}

const BannerTabContent: React.FC<BannerTabContentProps> = ({
                                                               tabIndex,
                                                               banner,
                                                               handleTabChange,
                                                               handleInputChange,
                                                               handleSingleSelectChange,
                                                               isFormValid,
                                                               hasChanges,
                                                               handleSave,
                                                               handleCancel,
                                                               columns,
                                                               rows,
                                                               selectedRows,
                                                               handleRemoveSelectedClients,
                                                               toolbar,
                                                               channels,
                                                               statuses,
                                                               typeBanners,
                                                               groupBannerDetails,
                                                               setSelectedRows,
                                                               initialData,
                                                               images,
                                                               onAddNewImageClick,
                                                               onSelectionChange,
                                                               selectedImages,
                                                               handleDeleteSelectedImage
                                                           }) => {
    return (
        <TabContext value={tabIndex.toString()}>
            <StyledTabList
                onChange={handleTabChange}
                tabs={[
                    { label: 'Основні', value: '0' },
                    { label: 'Дата', value: '1' },
                    { label: 'Зображення', value: '2'},
                    { label: 'Клієнти', value: '3' },
                    { label: 'Додатково', value: '4' },
                ]}
            />
            <TabPanel value="0">
                <CustomTextField
                    label="Назва"
                    name="title"
                    value={banner.title ?? ''}
                    onChange={handleInputChange}
                    required={true}
                />
                <CustomTextField
                    label="Назва для клієнта"
                    name="clientTitle"
                    value={banner.clientTitle ?? ''}
                    onChange={handleInputChange}
                    required={true}
                />
                <CustomSelectField
                    label="Тип банера"
                    value={banner.codeTypeBanner ?? ''}
                    name="codeTypeBanner"
                    options={typeBanners.map((type: BannerType) => ({
                        value: type.codeTypeBanner,
                        label: type.name,
                    }))}
                    onChange={handleSingleSelectChange}
                    required={true}
                />
                <CustomSelectField
                    label="Статус"
                    value={banner.status ?? ''}
                    name="status"
                    options={statuses.map((status: any) => ({
                        value: status.shortValue,
                        label: status.description,
                    }))}
                    onChange={handleSingleSelectChange}
                    required={false}
                />
                <CustomTextField
                    label="Група банера"
                    value={groupBannerDetails.name ?? ''}
                    onChange={handleInputChange}
                    disabled={true}
                    required={true}
                />
                <CustomTextField
                    label="Результат відправки"
                    name="sendResult"
                    value={banner.sendResult ?? ''}
                    onChange={handleInputChange}
                />
                {!isFormValid() && (
                    <Typography className={classes.errorText}>
                        Заповніть всі поля позначені *
                    </Typography>
                )}
                {hasChanges && (
                    <Box className={classes.actionsContainer}>
                        <Button variant="contained" onClick={handleSave} disabled={!isFormValid()}>
                            ЗБЕРЕГТИ
                        </Button>
                        <Button variant="contained" onClick={handleCancel}>
                            СКАСУВАТИ
                        </Button>
                    </Box>
                )}
            </TabPanel>
            <TabPanel value="1">
                <TextField
                    fullWidth
                    label="Запланована дата"
                    type="datetime-local"
                    name="plannedDate"
                    value={banner.plannedDate ?? ''}
                    onChange={handleInputChange}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
            </TabPanel>
            <TabPanel value="2">
                <Box className="dataGridContainer">
                    {selectedImages.length > 0 && (
                        <Box className="selectedItemsContainer">
                            <Box className="textContainer">
                                <Typography variant="body1">
                                    {selectedImages.length} вибрано
                                </Typography>
                            </Box>
                            <Box className="deleteIcon">
                                <IconButton aria-label="delete" onClick={handleDeleteSelectedImage}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    )}
                    <ImageDataGrid
                        height='500px'
                        images={images}
                        disableButton={initialData ? false : true}
                        onAddNewImageClick={onAddNewImageClick}
                        onSelectionChange={onSelectionChange}
                        checkboxSelection={true}
                    />
                </Box>
            </TabPanel>
            <TabPanel value="3">
                <Box className="dataGridContainer">
                    {selectedRows.length > 0 && (
                        <Box className="selectedItemsContainer">
                            <Box className="textContainer">
                                <Typography variant="body1">
                                    {selectedRows.length} вибрано
                                </Typography>
                            </Box>
                            <Box className="deleteIcon">
                                <IconButton aria-label="delete" onClick={handleRemoveSelectedClients}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    )}
                    {customTable({
                        height: '500px',
                        columns: columns,
                        rows: rows,
                        toolbar: toolbar,
                        loading: false,
                        getRowId: (row: any) => row.id,
                        onSelectionChange: (newSelectionModel) => setSelectedRows(newSelectionModel),
                        checkboxSelection: true,
                    })}
                </Box>
            </TabPanel>
            <TabPanel value="4">
                {initialData && (
                    <CustomTextField
                        label="Дата створення"
                        value={banner.dateCreate ?? ''}
                        disabled={true}
                    />
                )}
                <CustomSelectField
                    label="Канал відправки"
                    value={banner.channel ?? ''}
                    name="status"
                    options={channels.map((channel: any) => ({
                        value: channel.shortValue,
                        label: channel.description,
                    }))}
                    onChange={handleSingleSelectChange}
                    required={false}
                />
                <CustomTextField
                    label="Опис"
                    name="body"
                    value={banner.body ?? ''}
                    onChange={handleInputChange}
                />
                <CustomTextField
                    label="Код зовнішньої системи"
                    name="externalId"
                    value={banner.externalId ?? ''}
                    onChange={handleInputChange}
                />
                <CustomTextField
                    label="Примітка"
                    name="note"
                    value={banner.note ?? ''}
                    onChange={handleInputChange}
                />
                <CustomTextField
                    label="Посилання"
                    name="link"
                    value={banner.link ?? ''}
                    onChange={handleInputChange}
                />
                <CustomTextField
                    label="Баркод купону"
                    name="barcode"
                    value={banner.barcode ?? ''}
                    onChange={handleInputChange}
                />
            </TabPanel>
        </TabContext>
    );
};

export default BannerTabContent;
