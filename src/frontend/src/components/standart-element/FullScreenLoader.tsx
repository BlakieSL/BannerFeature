import React from 'react';
import {Backdrop, CircularProgress} from "@mui/material";

const fullScreenLoader = (): JSX.Element => {
    return (
        <>
            <Backdrop
                style={{ color: '#fff', zIndex: 4 }}
                open={true}
                //onClick={handleClose}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
};

export { fullScreenLoader};