import React from 'react';
import './Footer.css';

export default ({children, title, login})=>{
    
    return(
        <footer>
            <h1> {title} {children}</h1>
        </footer>
    
    );
}