import React from 'react';
import Login from '../login/page';
import Profile from './profile';
import Page from '../page';
import Home from './Home';
import Settings from './settings';
import Logout from './logout';

export default function Dashboard({ activeTab }) {
    const tabs = {
        Profile: <Profile />,
        Logout: <Login />,
        Dashboard:<Home/>,
        Settings: <Settings/>,
        Logout:<Logout/>

    };

    return (
        <div className="flex flex-1">
            {tabs[activeTab] || <>NO MATCH</>}
        </div>
    );
}
