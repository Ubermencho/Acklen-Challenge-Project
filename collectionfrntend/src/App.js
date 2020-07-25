import React, {Component} from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import PrivateRoute from './Components/SecureRoutes/SecureRoute';
import {setJWTBearer, setLocalStorage, getLocalStorage, removeLocalStorage} from './Components/Utilities/Utilities';

import Home from './Components/Pages/Public/Home/Home';
import SignIn from './Components/Pages/Public/Sign In/Signin';
import LogIn from './Components/Pages/Public/Login/Login';
import SharedCollection from './Components/Pages/Public/SharedCollection/SharedCollection';

import PrivateHome from './Components/Pages/Private/PrivateHome/PrivateHome';
import collections from './Components/Pages/Private/Collections/CollectionsList';
import newcollection from './Components/Pages/Private/Collections/NewCollection';
import collectionDetail from './Components/Pages/Private/Collections/CollectionDetail';
import newItem from './Components/Pages/Private/Items/NewItem';
import editItem from './Components/Pages/Private/Items/EditItem';
import deleteItem from './Components/Pages/Private/Items/DeleteItem';

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
    //console.log(user);
    const  jwt = user.jwt;
    const fuser = user.user;
    //console.log(fuser[0].userName);
    this.setState({
      ...this.state,
      isLogged:true,
      loadingBackend:false,
      user:fuser[0],
      jwt: jwt,
    });
    console.log(this.state.user);
    setJWTBearer(jwt);
    setLocalStorage('jwt', jwt);
    setLocalStorage('userID', fuser[0].userID);
    setLocalStorage('userName', fuser[0].userName);
  }

  logout(){
    removeLocalStorage('jwt');
    removeLocalStorage('userID');
    removeLocalStorage('userName');
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
        logout: this.logout,
      }

      //console.log(auth);

      return(
        <Router>
          <div className="App">
            <Switch>
              <Route render={(props) => {return (<Home {...props} auth={auth}/>)}} path="/" exact/>
              <Route render={(props) => {return (<SignIn {...props} auth={auth}/>)}} path="/signin" exact/>
              <Route render={(props) => {return (<LogIn {...props} auth={auth} login={this.login} />)}} path="/login" exact/>
              <Route render={(props) => {return (<SharedCollection {...props} auth={auth}/>)}} path="/collections/shared/:id" exact/>
              <PrivateRoute component={PrivateHome} path="/privatehome" exact auth={auth} />
              <PrivateRoute component={collections} path="/collections" exact auth={auth} />
              <PrivateRoute component={newcollection} path="/newcollection" exact auth={auth} />
              <PrivateRoute component={collectionDetail} path="/collections/:id" exact auth={auth} />
              <PrivateRoute component={newItem} path="/newItem" exact auth={auth} />
              <PrivateRoute component={editItem} path="/editItem/:id" exact auth={auth} />
              <PrivateRoute component={deleteItem} path="/deleteItem/:id" exact auth={auth} />
            </Switch>
          </div>
        </Router>
      )
    }
  
}

export default App;
