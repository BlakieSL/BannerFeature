import React, {useEffect, useState} from "react";
import {WorkplaceStatus} from "../../../model/interfaces";
import axios from "axios";
import styles from "./style.module.scss";
import Button from "@material-ui/core/Button";
import EditWorkplaceStatus from "../edit";
import {GridColDef} from "@mui/x-data-grid";
import {customTable} from "../../standart-element/DynamicElement";
import {quickSearchToolbar} from "../../standart-element/SearchToolbar";
import {GridRowParams, GridCellParams} from "@mui/x-data-grid";
import WifiTetheringIcon from "@mui/icons-material/WifiTethering";
import { GridRenderCellParams  } from '@mui/x-data-grid'

import {
    Checkbox,
    Select,
    Tooltip
} from "@mui/material";

type WorkplaceStatusListProps = {}

const WorkplaceStatusList: React.FC<WorkplaceStatusListProps> = (props: WorkplaceStatusListProps) => {
    const [itemList, setItemList] = useState<Array<WorkplaceStatus>>([])
    const [loading, setLoading] = useState(false)
    const [showEdit, setShowEdit] = useState(false)
    const [dateRefresh, setDateRefresh] = useState<Date>(new Date)
    const [currentItem, setCurrentItem] = useState<WorkplaceStatus | null>(null)
    const [localInterval, setLocalInterval] = useState(parseInt(localStorage.getItem('localInterval') ?? '-1'));
    const [checkIdWorkplace, setCheckIdWorkplace] = useState(localStorage.getItem('checkIdWorkplace') == 'true')
    const [idWorkplace, setIdWorkplace] = useState(parseInt(localStorage.getItem('idWorkplace') ?? '1'))
    const [checkCodeShop, setCheckCodeShop] = useState(localStorage.getItem('checkCodeShop') == 'true')
    const [codeShop, setCodeShop] = useState(parseInt(localStorage.getItem('codeShop') ?? '-1'))
    const [ignoreInterval, setIgnoreInterval] = useState(parseInt(localStorage.getItem('ignoreInterval') ?? '360'))
    const [problemInterval, setProblemInterval] = useState(parseInt(localStorage.getItem('problemInterval') ?? '5'))
    const [checkProblem, setCheckProblem] = useState(localStorage.getItem('checkProblem') == 'true')
    const [onlyActive, setOnlyActive] = useState(localStorage.getItem('onlyActive') == 'true')

    const refreshItemList = () => {
        setLoading(true)
        axios.get(`api-option/all-workplace-status-filtered`, {
            params: {
                toCheckIdWorkplace: checkIdWorkplace,
                idWorkplace: idWorkplace,
                toCheckCodeShop: checkCodeShop,
                codeShop: codeShop,
                ignoreInterval: ignoreInterval,
                problemInterval: problemInterval,
                toCheckProblem: checkProblem
            }
        })
            .then(response => {
                setItemList(response.data)
            })
            .catch(error => {
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        let interval: string | number | NodeJS.Timeout | undefined
        refreshItemList()

        if (localInterval != -1) {
            interval = setInterval(() => {
                refreshItemList()
            }, localInterval);
        }

        return () => {
            clearInterval(interval);
        };
    }, [dateRefresh])

    const table = (): JSX.Element => {
        const columns: GridColDef[] = [
            {field: 'codeShop', headerName: 'Магаз.', type: "number", width: 75},
            {field: 'idWorkplace', headerName: 'Каса', type: "number", width: 75},
            {field: 'status', headerName: 'Статус', type: "string", width: 75},
            {field: 'problem', headerName: 'Проблема', type: "string", minWidth: 155, flex: 1},
            {field: 'replicationBegin', headerName: 'Старт реплікації', type: "string", width: 155},
            {field: 'replicationEnd', headerName: 'Кінець реплікації', type: "string", width: 155},
            {field: 'successfulUpdate', headerName: 'Отримання даних на сервері', type: "string", width: 155},
            {field: 'successfulSend', headerName: 'Відправка даних на касу', type: "string", width: 155},
            {field: 'lastTimeError', headerName: 'Час останньої помилки', type: "string", width: 155,
                renderCell: (params: GridRenderCellParams) => <strong>{params.value}</strong>
            },
            {field: 'errorMessage', headerName: 'Текст помилки', type: "string", minWidth: 155, flex: 1,
                renderCell: (params: GridRenderCellParams) => <strong>{params.value}</strong>
            }
        ]

        const AdditionalBar = () => {
            return <>
                <Tooltip title="Показувати тільки активні каси" arrow>
                <span>
                      <Checkbox
                          checked={onlyActive}
                          onClick={() => {
                              setOnlyActive(!onlyActive)
                              localStorage.setItem('onlyActive', String(!onlyActive));
                          }
                      }
                          //disabled={loading || selectedCodeDepartment == -1 || !waresEditing}
                          icon={<WifiTetheringIcon/>}
                          checkedIcon={<WifiTetheringIcon color={'primary'}/>}
                      />
                </span>
                </Tooltip>
            </>
        }
        // list, label, value, setValue
        const list = {
            '5000': '5 с',
            '30000': '30 с',
            '60000': '1 хв',
            '300000': '5 хв',
            '600000': '10 хв',
            '1800000': '30 хв',
            '3600000': '1 год',
            '-1': 'Не оновлювати автоматично'
        }

        function toolbar() {
            return quickSearchToolbar([
                {
                    func: filter,
                    text: "Фільтр"
                }
            ], [
                {
                    list: list,
                    label: 'Інтервал оновлення',
                    value: localInterval,
                    setValue: (value: any) => {
                        localStorage.setItem('localInterval', String(value))
                        window.location.reload();
                    }
                }
            ], AdditionalBar)
        }

        const getRowClassName = (params: GridRowParams) => {
            if (params.row['problem']?.length > 0) {
                return 'theme--error';
            } else if (params.row['problem']?.length === 0 && params.row['status'] === 'Online') {
                return 'theme--active';
            }
            return '';
        };

        const getCellClassName = (params: GridCellParams) => {
            if (params.field === 'errorMessage' || params.field === 'lastTimeError') {
                return styles['custom-row-class']; // Используйте класс из файла стилей
            }
            return '';
        };

        const filteredRows = () =>  {
            if(onlyActive){
                return itemList.filter(({status, problem}) => problem.length > 0 || status !== 'Offline')
            }

            return itemList
        }

        return customTable({
            height: `calc(100vh - 110px)`,
            columns: columns,
            rows: filteredRows(),
            getRowId: (row: any) => `${row.codeShop}.${row.idWorkplace}`,
            //rowId: "codeScale",
            toolbar: toolbar,
            onRowDoubleClick: undefined,
            loading: undefined,
            getRowClassName: getRowClassName,
            getCellClassName: getCellClassName,
        })
    }


    const filter = () => {
        setCurrentItem(null)
        setShowEdit(true)
    }

    const buttonPanel = (): JSX.Element => {
        const options = [
            {value: '5000', label: '5 с'},
            {value: '30000', label: '30 с'},
            {value: '60000', label: '1 хв'},
            {value: '300000', label: '5 хв'},
            {value: '600000', label: '10 хв'},
            {value: '1800000', label: '30 хв'},
            {value: '3600000', label: '1 год'},
            {value: '-1', label: 'Не оновлювати автоматично'}
        ]

        return <div className={styles.topButtonPanel}>

            <div className={styles.child}>Інтервал оновлення:</div>
            <Select
                className={styles.child}
                fullWidth={true}
                value={localInterval}
                onChange={e => {
                    localStorage.setItem('localInterval', String(e.target.value));
                    window.location.reload();
                }}
            >
                {options.map(it => <option value={it.value}>{it.label}</option>)}
            </Select>

            <Button
                aria-valuetext={"Фільтр"}
                //size={"small"}
                //fullWidth={true}
                variant="contained"
                onClick={filter}
                color="primary"
                className={styles.child}>Фільтр
            </Button>
        </div>
    }

    const refresh = () => {
        setDateRefresh(new Date())
    }

    const editItemForm = (): JSX.Element => {
        return (<EditWorkplaceStatus
            show={showEdit}
            setShow={setShowEdit}
            refresh={refresh}
            workplaceStatus={currentItem}
            workplaceStatusList={itemList!!}
            checkIdWorkplace={checkIdWorkplace}
            setCheckIdWorkplace={setCheckIdWorkplace}
            idWorkplace={idWorkplace}
            setIdWorkplace={setIdWorkplace}
            checkCodeShop={checkCodeShop}
            setCheckCodeShop={setCheckCodeShop}
            codeShop={codeShop}
            setCodeShop={setCodeShop}
            ignoreInterval={ignoreInterval}
            setIgnoreInterval={setIgnoreInterval}
            problemInterval={problemInterval}
            setProblemInterval={setProblemInterval}
            checkProblem={checkProblem}
            setCheckProblem={setCheckProblem}
        />)
    }

    return (<div className={styles.content}>
        <h3 className={styles.header}>Статус роботи кас</h3>
        {/*buttonPanel()*/}
        {table()}
        {showEdit && editItemForm()}
    </div>)
}

export default WorkplaceStatusList