import React, {Component} from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import PrivateRoute from './Components/SecureRoutes/SecureRoute';
import {setJWTBearer, setLocalStorage, getLocalStorage, removeLocalStorage} from './Components/Utilities/Utilities';

import Home from './Components/Pages/Public/Home/Home';

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
            </Switch>
          </div>
        </Router>
      )
    }
  
}

export default App;
