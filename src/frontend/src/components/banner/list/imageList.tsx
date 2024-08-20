import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../types";
import React, {useEffect, useState} from "react";
import {fetchAllBannersImages} from "../../../actions/imageActions";
import Loader from "../../loader/Loader";
import {GridColDef, GridRowParams} from "@mui/x-data-grid";
import {Box, Checkbox, FormControlLabel, Typography} from "@mui/material";
import {customTable} from "../../standart-element/DynamicElement";
import {quickSearchToolbar} from "../../standart-element/SearchToolbar";
import ImageDataGrid from "../helperComponents/ImageDataGrid";
const ImageList = () => {
    const dispatch = useDispatch();
    const images = useSelector((state: RootState) => state.imageListReducer.allImages);
    const [loading, setLoading] = useState(false);

    useEffect(() =>{
        (async() => {
            setLoading(true);
            await dispatch(fetchAllBannersImages());
            setLoading(false);
        })();
    },[dispatch]);

    if(loading) {
        return <Loader/>
    }


    return (
        <Box>
            <Box className='headerContainerBase'>
                <Typography variant='h4'>Зображення банерів</Typography>
            </Box>
           <ImageDataGrid
               images={images}
               height='calc(100vh - 56px)'
               showButtons={false}
           />
        </Box>
    );
}

export default ImageList;
