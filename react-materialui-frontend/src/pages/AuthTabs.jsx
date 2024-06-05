import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import SignUp from '../components/tabs/SignUp';
import SignIn from '../components/tabs/SignIn';

const AuthTabs = () => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Box sx={{  }}>
            <Tabs value={activeTab} onChange={handleTabChange} centered>
                <Tab label="Войти" />
                <Tab label="Регистрация" />
            </Tabs>
            {activeTab === 0 && <SignIn />}
            {activeTab === 1 && <SignUp />}
        </Box>
    );
};

export default AuthTabs;
