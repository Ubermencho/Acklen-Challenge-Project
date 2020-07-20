import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './Page.css';

export default ({pageTitle, hideHeader, children, auth})=>{
    const finalHideHeader = hideHeader || false;
    return(
        <section className="page">
            {(!finalHideHeader)?(<Header  auth={auth}></Header>):null}
            <main>
                {children}
            </main>
            <Footer>{pageTitle || "page"}</Footer>
        </section>
    );
}