import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {lighten, makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import {ViewList} from "@material-ui/icons";

function createData(name, calories, fat, carbs, protein) {
    return {name, calories, fat, carbs, protein};
}


function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {

    const {
        classes,
        onSelectAllClick,
        order,
        orderBy,
        numSelected,
        rowCount,
        onRequestSort,
        header,
        enableCheckBox = true,
        enableEdit = false
    } = props;

    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {enableCheckBox &&
                    <TableCell
                        width="10%"
                        style={{
                            overflowWrap: 'anywhere'
                        }}

                        padding="checkbox">
                        <Checkbox
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                            inputProps={{'aria-label': 'select all desserts'}}
                        />
                    </TableCell>
                }
                {enableEdit && <TableCell
                    width="10%"
                    style={{
                        overflowWrap: 'anywhere'
                    }}

                ></TableCell>}
                {header.map((headCell) => (
                    <TableCell
                        width="10%"
                        style={{
                            overflowWrap: 'anywhere'
                        }}
                        key={headCell.id}

                        //align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: '1 1 100%',
    },
}));

const EnhancedTableToolbar = (props) => {
    const classes = useToolbarStyles();
    const {numSelected, title, deleteItems} = props;

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    {numSelected} выбрано
                </Typography>
            ) : (
                <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                    {title}
                </Typography>
            )}

            {numSelected > 0 ? (deleteItems !== undefined) && (
                <Tooltip title="Удалить выбранные">
                    <IconButton aria-label="delete"
                        //onClick={deleteItems}
                    >
                        <DeleteIcon/>
                    </IconButton>
                </Tooltip>
            ) : ''
                /*
                            (
                                <Tooltip title="Filter list">
                                    <IconButton aria-label="filter list">
                                        <FilterListIcon />
                                    </IconButton>
                                </Tooltip>
                            )
                */
            }
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    container: {
//        maxHeight: 700,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
}));

export default function EnhancedTable({
                                          header,
                                          rows,
                                          idColumn,
                                          title,
                                          selected,
                                          setSelected,
                                          deleteItems = null,
                                          enableCheckBox = true,
                                          onClick = {},
                                          rowClassName = null,
                                          maxHeight,
                                          initRowsPerPage = 5,
                                          enableEdit = false,
                                          editIcon = 'edit',
                                          editTitle = "",
                                          onEdit = null,
                                          onClickInSelectMode = () => {
                                          },
                                          locked = (row) => {
                                              return false
                                          },
                                          tableName
                                      }) {
    const classes = useStyles();
    const [order, setOrder] = React.useState(localStorage.getItem('SortingOrder') ?? 'asc');
    const [orderBy, setOrderBy] = React.useState(localStorage.getItem('SortingOrderBy') ?? 'calories');
    const [page, setPage] = React.useState(parseInt(sessionStorage.getItem(tableName + '_page'), 10) || 0);
    const [rowsPerPage, setRowsPerPage] = React.useState(parseInt(sessionStorage.getItem(tableName + '_rows'), 10) || initRowsPerPage);
    const [dense, setDense] = React.useState(false);

    const getRowsPerPageOptions = () => {
        const list = [];
        [10, 25, 50, 100].forEach(i => {
            if (i < rows.length) list.push(i)
        })
        list.push(rows.length)
        return list
    }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);

        localStorage.setItem('SortingOrder', String(isAsc ? 'desc' : 'asc'));
        localStorage.setItem('SortingOrderBy', String(property));
    };

    const handleSelectAllClick = (event) => {
        if (enableCheckBox) {
            if (event.target.checked) {
                const newSelecteds = rows.map((n) => n[idColumn]);
                setSelected(newSelecteds);
                return;
            }
            setSelected([]);
        }
    };

    const handleClick = (event, object) => {
        if (locked(object)) return
        if (enableCheckBox) {
            const id = object[idColumn]
            const selectedIndex = selected.indexOf(id);
            let newSelected = [];

            if (selectedIndex === -1) {
                newSelected = newSelected.concat(selected, id);
            } else if (selectedIndex === 0) {
                newSelected = newSelected.concat(selected.slice(1));
            } else if (selectedIndex === selected.length - 1) {
                newSelected = newSelected.concat(selected.slice(0, -1));
            } else if (selectedIndex > 0) {
                newSelected = newSelected.concat(
                    selected.slice(0, selectedIndex),
                    selected.slice(selectedIndex + 1),
                );
            }
            onClickInSelectMode(event, object, newSelected)
            setSelected(newSelected);
        } else {
            onClick(object)
        }

    };

    const handleChangePage = (event, newPage) => {
        console.log(`newPage = ${newPage}`)

        setPage(newPage);
        sessionStorage.setItem(tableName + '_page', newPage)
    };

    const getLabelDisplayedRows = ({from, to, count}) => {
        if (to % rowsPerPage !== 0 && !(getRowsPerPageOptions().includes(rowsPerPage))) {
            console.log(`setRowsPerPage = ${to}`)
            setRowsPerPage(to)
            from = 1
        }
        /*
        if(to < rowsPerPage){
            setRowsPerPage(10)
            setPage(0)
            from = 1

        } else
         if (to > rowsPerPage){

        if (to > rowsPerPage){
            setPage((to - to%rowsPerPage)/rowsPerPage - 1)
            from = (to - to%rowsPerPage) + 1
            setRowsPerPage(10)

        } else
            */
        if (from > to) {
            setPage(from % rowsPerPage - 1)
            //from = (to - to%rowsPerPage) + 1
        }

        return `${from}-${to} из ${count !== -1 ? count : to}`
    }

    const handleChangeRowsPerPage = (event) => {
        console.log(`event.target.value = ${event.target.value}`)

        sessionStorage.setItem(tableName + '_rows', event.target.value)
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const isSelected = (name) => {
        return selected.indexOf(name) !== -1;
    }

    // const emptyRows = getRowsPerPage() - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    //handleRequestSort(null, localStorage.getItem('SortingProperty'));

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                {enableCheckBox &&
                    <EnhancedTableToolbar numSelected={selected.length} title={title} deleteItems={deleteItems}/>}
                <TableContainer style={{maxHeight: maxHeight}}>
                    <Table stickyHeader aria-label="sticky table"
                           className={classes.table}
                        // aria-labelledby="tableTitle"
                        //size={dense ? 'small' : 'medium'}
                           size={'small'}

                        //                        aria-label="enhanced table"
                        //    stickyHeader={true}
                    >
                        <EnhancedTableHead
                            classes={classes}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                            header={header}
                            enableCheckBox={enableCheckBox}
                            enableEdit={enableEdit}
                        />
                        <TableBody
                        >


                            {stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const isItemSelected = isSelected(row[idColumn]);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            //                                            onClick={(event) => handleClick(event, row)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row[idColumn]}
                                            selected={isItemSelected}
                                            className={rowClassName && rowClassName(row)}
                                        >
                                            {enableCheckBox &&
                                                <TableCell padding="checkbox"
                                                           width="10%"
                                                           style={{
                                                               overflowWrap: 'anywhere'
                                                           }}


                                                    //onClick={(event) => handleClick(event, row)}
                                                >
                                                    <Checkbox
                                                        checked={isItemSelected}
                                                        inputProps={{'aria-labelledby': labelId}}
                                                        disabled={locked(row)}
                                                    />
                                                </TableCell>
                                            }
                                            {enableEdit &&
                                                <TableCell
                                                    width="10%" style={{
                                                    overflowWrap: 'anywhere'
                                                }}

                                                >
                                                    {!locked(row) &&
                                                        <IconButton size={'small'}
                                                            //onClick={(event) => onEdit(row)} title={editTitle}
                                                        >
                                                            {editIcon === 'view' ?
                                                                <ViewList fontSize={'small'} id={'edit'}/> :
                                                                <EditIcon className={"edit-icon"} fontSize={'small'}
                                                                          id={'edit'} disabled={locked(row)}/>}
                                                        </IconButton>}
                                                </TableCell>
                                            }
                                            {header.map((h, index) => <TableCell
                                                width="10%" style={{
                                                overflowWrap: 'anywhere'
                                            }}
                                                key={index}


                                                //align={"left"}
                                                className={h.className}
                                                //onClick={(event) => handleClick(event, row)}
                                            >
                                                {(h.type === 'image' && row[h.id] != null) ?
                                                    <img src={`data:image/jpg;base64,${row[h.id]}`}/> : row[h.id]}
                                            </TableCell>)}
                                        </TableRow>
                                    );
                                })}
                            {/*                            {emptyRows > 0 && (
                                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}*/}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={getRowsPerPageOptions()}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    labelRowsPerPage={"Строк на странице:"}
                    labelDisplayedRows={getLabelDisplayedRows}
                />
            </Paper>
            {/*            <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Dense padding"
            />*/}
        </div>
    );
}
