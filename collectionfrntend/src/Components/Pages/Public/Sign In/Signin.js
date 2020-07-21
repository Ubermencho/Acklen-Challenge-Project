import React, {Component} from 'react';
import Page from '../../Page';
import Field from '../../../Forms/Field';
import {Actions} from '../../../Forms/Button';
import {emailRegex, emptyRegex} from '../../../Forms/Validators';

import {paxios} from '../../../Utilities/Utilities';
import './Signin.css';

export default class Signin extends Component{
    constructor(){
        super();
        this.state ={
            userName:'',
            userNameError: null,
            userEmail:'',
            userEmailerror: null,
            userPassword: '',
            userPassworderror: null
        }

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onClickCreateAccount = this.onClickCreateAccount.bind(this);
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

      onClickCreateAccount(e) {
        e.preventDefault();
        e.stopPropagation();
        const errors = this.validate();
        if (errors) {
          this.setState({ ...this.state, ...errors });
        } else {
          const userName = this.state.userName;
          const userPass = this.state.userPassword;
          const userMail = this.state.userEmail;
          paxios.post( `/api/user/new`,{
              email: userMail,
              pass: userPass,
              name: userName
            }
          )
            .then((resp) => {
              alert(resp.data);
            })
            .catch((error) => {
                alert(error);
            })
        }
      }

    render(){
        return(
            <Page pageTitle="New Account" auth={this.props.auth}>
                <body   className="body">
                <Field
                name="userName"
                caption="User Name"
                value={this.state.userName}
                type="text"
                onChange={this.onChangeHandler}
                error={this.userNameError}
                />
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
                type="text"
                onChange={this.onChangeHandler}
                error={this.userPassworderror}
                />

                <Actions>
                    <button onClick={this.onClickCreateAccount}>Create my Account</button>
                </Actions>
                </body>

            </Page>
        )
    }

}