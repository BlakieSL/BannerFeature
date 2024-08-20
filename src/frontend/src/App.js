import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Navbar } from "./components/navbar/Navbar";
import AuthenticationService from "./service/AuthenticationService";
import Login from './components/login/Login';
import WorkplaceStatusList from "./components/workplace-status/list";
import GroupBannerList from "./components/banner/list/groupBannerList";
import BannerList from "./components/banner/list/bannerList";
import ImageList from "./components/banner/list/imageList";

const App = () => {
    const router = () => {
        return (
            <BrowserRouter>
                <Navbar />
                <div>
                    <Routes>
                        <Route path="/" element={<WorkplaceStatusList />} />
                        <Route path="/workplace-status" element={<WorkplaceStatusList />} />
                        <Route path="/group-banners" element={<GroupBannerList />} />
                        <Route path="/banners/group/:groupId" element={<BannerList />} />
                        <Route path="/banners/all" element={<BannerList />} />
                        <Route path="/images/all" element={<ImageList />} />
                    </Routes>
                </div>
            </BrowserRouter>
        );
    };

    const login = () => {
        return (
            <React.Fragment>
                <BrowserRouter>
                    <Routes>
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </BrowserRouter>
                <Login />
            </React.Fragment>
        );
    };

    return (
        <React.Fragment>
            {AuthenticationService.isUserLoggedIn() ? router() : login()}
        </React.Fragment>
    );
}

export default App;
