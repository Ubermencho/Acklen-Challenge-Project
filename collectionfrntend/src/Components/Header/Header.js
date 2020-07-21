import React, { Component } from 'react';
import {IoIosLogIn, IoIosHome, IoIosFolder} from 'react-icons/io';
import {NavLink, Redirect} from 'react-router-dom';
import './Header.css';

export default class Header extends Component{
    constructor(){
        super();
        this.state={
            counter:0
        }
        this.counterUdpate = this.counterUdpate.bind(this);
        this.logoutOnClick = this.logoutOnClick.bind(this);
    }

    counterUdpate(e){
        e.preventDefault();
        e.stopPropagation();
        this.setState({counter:this.state.counter+1});
    }

    logoutOnClick(e){
        e.preventDefault();
        e.stopPropagation();
        this.props.auth.logout();
    }

    render(){
        if(this.props.hide && true){
            return null;
        }
        if(this.props.auth && this.props.auth.isLogged && true){
            return(
                <header>
                    <nav>
                        <ul>
                            <li><NavLink to="/privatehome"><IoIosHome/>Home</NavLink></li>
                            <li><NavLink to="/"><IoIosFolder/>My Collections</NavLink></li>
                            <li><a onClick={this.logoutOnClick}><IoIosLogIn/>Logout</a></li>
                        </ul>
                    </nav>
                </header>
            );
        }else{
            return(
                <header>
                    <nav>
                        <ul>
                        <li><NavLink to="/"><IoIosHome/>Home</NavLink></li>
                        <li><NavLink to="/signin"><IoIosLogIn/>Sign in</NavLink></li>
                        <li><NavLink to="/login"><IoIosLogIn/>Login</NavLink></li>
                        </ul>
                    </nav>
                </header>
            );
        }
    }
}