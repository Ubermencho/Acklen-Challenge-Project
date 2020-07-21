import React from 'react';
import Page from '../../Page';
import {getLocalStorage} from '../../../Utilities/Utilities';

import './PrivateHome.css';

export default ({auth})=>{
    return(
        <Page pageTitle="Collection Tracker V1.0" auth={auth} >
            <body>
            <p className="HomeWelcome">Welcome, {getLocalStorage('userName')}!!</p>
            </body>
        </Page>
    )
}