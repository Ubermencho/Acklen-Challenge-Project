import React, {Component} from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import PrivateRoute from './Components/SecureRoutes/SecureRoute';
import {setJWTBearer, setLocalStorage, getLocalStorage, removeLocalStorage} from './Components/Utilities/Utilities';

import Home from './Components/Pages/Public/Home/Home';
import SignIn from './Components/Pages/Public/Sign In/Signin';
import LogIn from './Components/Pages/Public/Login/Login';

class App extends Component {
  constructor(){
    super();
    this.state={
      user: getLocalStorage('user') || {},
      jwt: getLocalStorage('jwt') || '',
      isLogged: false,
      loadingBackend: false
    };
    if(this.state.jwt !== ''){
      this.state.isLogged = true;
      setJWTBearer(this.state.jwt);
    }

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  login(user){
    const  {jwt, ...fuser} = user;
    this.setState({
      ...this.state,
      isLogged:true,
      loadingBackend:false,
      user:fuser,
      jwt: jwt,
    });
    setJWTBearer(jwt);
    setLocalStorage('jwt', jwt);
    setLocalStorage('user', fuser);
  }

  logout(){
    removeLocalStorage('jwt');
    removeLocalStorage('user');
    this.setState({
      ...this.state,
      isLogged:false,
      user:{},
      jwt:''
    })
  }

    render(){
      const auth = {
        isLogged: this.state.isLogged,
        user: this.state.user,
      }

      return(
        <Router>
          <div className="App">
            <Switch>
              <Route render={(props) => {return (<Home {...props} auth={auth}/>)}} path="/" exact/>
              <Route render={(props) => {return (<SignIn {...props} auth={auth}/>)}} path="/signin" exact/>
              <Route render={(props) => {return (<LogIn {...props} auth={auth} login={this.login} />)}} path="/login" exact/>
            </Switch>
          </div>
        </Router>
      )
    }
  
}

export default App;
