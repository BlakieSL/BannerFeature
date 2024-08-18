import { Tab } from '@mui/material';
import { TabList, TabListProps } from '@mui/lab';
import {FC} from "react";

interface StyledTabListProps extends TabListProps {
    tabs: { label: string, value: string | number }[];
}

const StyledTabList: FC<StyledTabListProps> = ({ tabs, ...props }) => {
    return (
        <TabList
            className='tab-list'
            {...props}
        >
            {tabs.map((tab) => (
                <Tab
                    key={tab.value}
                    label={tab.label}
                    value={tab.value}
                    className='MuiTab-root'
                />
            ))}
        </TabList>
    );
}

export default StyledTabList;