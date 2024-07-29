import React, {useEffect, useRef, useState} from 'react';
import {
    Box,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    Tooltip
} from "@mui/material";
import Button from "@material-ui/core/Button";
import {GridToolbarQuickFilter} from "@mui/x-data-grid";
import styles from "./style.module.scss";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import TextField from "@mui/material/TextField";

function quickSearchToolbar(buttons: Array<any>, singleSelectArr: Array<any> = [], additionalBar: any = undefined) {
    return (
        <Box
            sx={{
                pl: 1,
                pr: 1,
                pb: 1,
                pt: 1,
                display: 'flex',
            }}
        >
            <Stack direction="row" spacing={1} paddingRight={1}>
                {additionalBar && additionalBar()}
                {singleSelectArr.map(({list, label, value, setValue}: any) => (
                    <FormControl style={{width: 250}}>
                        <InputLabel id="test-select-label">{label}</InputLabel>
                        <Select
                            size={'small'}
                            value={value}
                            labelId="test-select-label"
                            label={label}
                            onChange={(event: SelectChangeEvent<any>) => {
                                const {
                                    target: {value},
                                } = event;

                                setValue(Number(value));
                            }}
                        >
                            {
                                Object.keys(list).map((key: string) => (
                                    <MenuItem
                                        key={key} value={key}
                                    >
                                        {list[key]}
                                    </MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                ))}
                {buttons.map(({func, text, disabled = false, hint = ''}: any) => (
                    <Tooltip title={hint}>
                        <span>
                        <Button
                            variant="contained" color="primary"
                            //style={{color: "white", backgroundColor: '#3f51b5'}}
                            size='medium'
                            disabled={disabled}
                            onClick={(e) => {
                                func()
                            }
                            }
                        >
                            {text}
                        </Button>
                            </span>
                    </Tooltip>

                ))}
            </Stack>
            <GridToolbarQuickFilter
                style={{flex: 1}}

                quickFilterParser={(searchInput: string) =>
                    searchInput
                        .split(',')
                        .map((value) => value.trim())
                        .filter((value) => value !== '')
                }
                debounceMs={500}
            />
        </Box>
    )
}

const DbSearchToolbar = (props: any) => {
    const {
        paramsLabel,
        searchParams,
        searchValue,
        searchFunc,
        searchParam
    } = props;

    const [value, setValue] = useState<string>(searchValue)
    const [selectedSearchParam, setSelectedSearchParam] = useState<number>(searchParam)

    return (
        <Box
            sx={{
                pl: 1,
                pr: 1,
                pb: 1,
                pt: 1,
                display: 'flex',
            }}
        >
            <Stack direction="row" spacing={1} paddingRight={1}>
                <FormControl style={{width: 250}} key={paramsLabel}>
                    <InputLabel id={`${paramsLabel}-select-label`}>{paramsLabel}</InputLabel>
                    <Select
                        size="small"
                        value={selectedSearchParam}
                        labelId={`${paramsLabel}-select-label`}
                        label={paramsLabel}
                        onChange={(event: SelectChangeEvent<any>) => {
                            const {
                                target: {value},
                            } = event;

                            setSelectedSearchParam(Number(value));
                        }}
                    >
                        {Object.keys(searchParams).map((key: string) => (
                            <MenuItem key={key} value={key}>
                                {searchParams[key]}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Stack>
            <TextField
                autoFocus={true}
                fullWidth={true}
                style={{flex: 1}}
                size="small"
                variant="standard"
                onChange={(it) => setValue(it.target.value)}
                placeholder="Пошук..."
                value={value}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon/>
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment
                            position="end"
                            style={{display: value === '' ? 'none' : 'flex'}}
                            onClick={() => {
                                setValue('');
                            }}
                        >
                            <ClearIcon/>
                        </InputAdornment>
                    ),
                }}
            />
            <Stack direction="row" spacing={1} paddingRight={1}>
                <Button
                    key={'0'}
                    variant="contained"
                    color="primary"
                    size="medium"
                    disabled={false}
                    onClick={(e) => {
                        searchFunc(selectedSearchParam, value);
                    }}
                >
                    Пошук
                </Button>
            </Stack>
        </Box>
    );
};

export {quickSearchToolbar, DbSearchToolbar};

