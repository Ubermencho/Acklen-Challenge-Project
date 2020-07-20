import React from 'react';
import './Footer.css';

export default ({children, title, login})=>{
    
    return(
    <h1> {title} {children}</h1>
    );
}