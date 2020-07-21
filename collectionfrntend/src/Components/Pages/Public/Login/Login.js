import React, {Component} from 'react';
import Page from '../../Page';
import Field from '../../../Forms/Field';
import {Actions} from '../../../Forms/Button';
import {emailRegex, emptyRegex} from '../../../Forms/Validators';

import {paxios, setLocalStorage} from '../../../Utilities/Utilities';
import {NavLink, Redirect} from 'react-router-dom';

export default class Login extends Component{

    constructor(){
        super();
        this.state={
            userEmail:'',
            userEmailerror:null,
            userPassword:'',
            userPassworderror:null,
            redirectTo:false
        }
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onClickLogin = this.onClickLogin.bind(this);
        this.validate = this.validate.bind(this);
    }

    validate() {
        let nameErrors = null;
        let tmpErrors = [];
        const email = this.state.userEmail;
        const password = this.state.userPassword;
        if (email !== undefined) {
          if (!emailRegex.test(email)) {
            tmpErrors.push("Your E-mail is an incorrect format");
          }
          if ((/^\s*$/.test(email))) {
            tmpErrors.push("You must enter an adecuate E-mail");
          }
          if (tmpErrors.length) {
            nameErrors = Object.assign({}, nameErrors, { emailError: tmpErrors.join('. ') });
            alert(nameErrors.emailError);
          }
        }
        if (password !== undefined) {
          tmpErrors = [];
          if ((emptyRegex.test(password))) {
            tmpErrors.push("Please enter a password");
          }
          if (tmpErrors.length) {
            nameErrors = Object.assign({}, nameErrors, { passwordError: tmpErrors.join('. ') });
            alert(nameErrors.passwordError);
          }
        }  
        return nameErrors;
      }

      onChangeHandler(e) {
        const { name, value } = e.currentTarget;
        
        this.setState({...this.state,[name]: value,});
      }


      onClickLogin(e){
          e.preventDefault();
          e.stopPropagation();
          const errors = this.validate();
          if(errors){
              this.setState({...this.state, ...errors});
          }else{
              const userEmail = this.state.userEmail;
              const userPassword = this.state.userPassword;
              paxios.post("/api/user/login", {userEmail:userEmail, userPassword:userPassword})
              .then((resp)=>{
                  console.log(resp.data);
                  if(resp.data==="User not found!"){
                      alert(resp.data);
                  }else{
                      alert(resp.data.Message);
                      this.props.login(resp.data);
                      this.setState({...this.state, redirectTo: true });
                      
                  }
              })
              .catch((error)=>{
                console.log(error);
              })
          }
      }


      render(){
        if (this.state.redirectTo){
            const redirect = (this.props.location.state) ? this.props.location.state.from.pathname : '/privatehome';
            return (<Redirect to={redirect} />);
          }
        return(
            <Page pageTitle="Login" auth={this.props.auth}>
                <body   className="body">
                <Field
                name="userEmail"
                caption="Your E-mail"
                value={this.state.userEmail}
                type="text"
                onChange={this.onChangeHandler}
                error={this.userEmailError}
                />
                <Field
                name="userPassword"
                caption="Your Password..."
                value={this.state.userPassword}
                type="password"
                onChange={this.onChangeHandler}
                error={this.userPassworderror}
                />

                <Actions>
                    <button onClick={this.onClickLogin}>Login</button>
                    <NavLink to="signin"><button>Create an Account</button></NavLink>
                </Actions>
                </body>

            </Page>
        )
    }




}