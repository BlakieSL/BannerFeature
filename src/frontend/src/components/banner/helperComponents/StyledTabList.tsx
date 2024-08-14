import React, { FC } from 'react';
import { Tab } from '@mui/material';
import { TabList, TabListProps } from '@mui/lab';

interface StyledTabListProps extends TabListProps {
    tabs: { label: string, value: string | number }[];
}

const StyledTabList: FC<StyledTabListProps> = ({ tabs, ...props }) => {
    return (
        <TabList
            {...props}
            sx={{
                '& .MuiTabs-indicator': {
                    display: 'none',
                },
                '& .MuiTab-root': {
                    textTransform: 'none',
                },
                borderBottom: 1,
                borderColor: '#cccccc',
                backgroundColor: '#f1f1f1',
                ...props.sx,
            }}
        >
            {tabs.map((tab) => (
                <Tab
                    key={tab.value}
                    label={tab.label}
                    value={tab.value}
                    sx={{
                        backgroundColor: '#f1f1f1',
                        '&.Mui-selected': {
                            backgroundColor: '#cccccc',
                            color: 'black',
                        },
                        '&:hover': {
                            backgroundColor: '#e0e0e0',
                        },
                    }}
                />
            ))}
        </TabList>
    );
};

export default StyledTabList;
