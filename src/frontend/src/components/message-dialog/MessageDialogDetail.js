import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import {Button} from "@material-ui/core";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}));

const MessageDialogDetail = ({show, setShow, text, detail}) => {
    const hide = () => {
        setShow(false)
    }
    const classes = useStyles();

    return (
        <Dialog
            open={show}
            onClose={() => setShow(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth={true}
            maxWidth={'sm'}
        >
            <DialogTitle id="alert-dialog-title">Внимание</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <div className='message-body'>
                        <div><p>{text}</p></div>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography className={classes.heading}>Подробности</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    {detail}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={hide} color="primary"> Ок </Button>
            </DialogActions>
        </Dialog>
    )
}

export default MessageDialogDetail