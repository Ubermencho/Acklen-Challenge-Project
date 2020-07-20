import React from 'react';
import Page from '../../Page';

import './Home.css';

export default ({auth})=>{
    
    return(
        <Page pageTitle="Collection Tracker V1.0" auth={auth} >
            <body>
                <p className="HomeWelcome">Welcome to the Collection Tracker Web-App</p>
            </body>
        </Page>
    )
}