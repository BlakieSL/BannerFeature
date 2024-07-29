import Dialog from "@material-ui/core/Dialog";
import styles from "./style.module.scss";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import React from "react";

type LoaderProgressProps = {
    show: boolean,
    setShow: (show: boolean) => void
    text: string
    currentProgress: string
    max: string
}

const LoaderProgress: React.FC<LoaderProgressProps> = (props: LoaderProgressProps) => {
    return (<Dialog
            open={props.show}
            onClose={() => props.setShow(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth={true}
            maxWidth={'sm'}
            className={styles.dialog}
        >
            <DialogTitle id="alert-dialog-title">
                <div className={styles.header}>{props.text}</div>
            </DialogTitle>
            <DialogContent>
                <progress className={styles.progress} id="file" max={props.max} value={props.currentProgress}> qq </progress>
            </DialogContent>
        </Dialog>
    )
}

export default LoaderProgress