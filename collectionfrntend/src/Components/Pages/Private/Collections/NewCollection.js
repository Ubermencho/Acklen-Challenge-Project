import React, {Component} from 'react';
import Page from '../../Page';
import Field from '../../../Forms/Field';
import {Actions} from './../../../Forms/Button';
import {emptyRegex} from '../../../Forms/Validators';
import ReactCrop from 'react-image-crop';
import exif from 'exif-js';
import 'react-image-crop/dist/ReactCrop.css';

import {saxios, getLocalStorage} from '../../../Utilities/Utilities';

export default class NewCollection extends Component{
    constructor(){
        super();
        this.state={
            colltitle:'',
            colltitleerr:null,
            colldesc:'',
            colldescerr:null,
            collextras:'',
            collPic:{},
            itemID:0
            
        }
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.validate = this.validate.bind(this);
        this.onClickAddCollection = this.onClickAddCollection.bind(this);
    }



    validate() {
        let nameErrors = null;
        let tmpErrors = [];
        const title = this.state.colltitle;
        const description = this.state.colldesc;
        if (title !== undefined) {
          if (emptyRegex.test(title)) {
            tmpErrors.push("Please enter a Title");
          }
          if (tmpErrors.length) {
            nameErrors = Object.assign({}, nameErrors, { emailError: tmpErrors.join('. ') });
            alert(nameErrors.emailError);
          }
        }
        if (description !== undefined) {
          tmpErrors = [];
          if ((emptyRegex.test(description))) {
            tmpErrors.push("Please enter a Description");
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


    onClickAddCollection(e){
        e.preventDefault();
        e.stopPropagation();
        const errors = this.validate();
        if (errors) {
          this.setState({ ...this.state, ...errors });
        }else{
            const colltitle = this.state.colltitle;
            const colldesc = this.state.colldesc;
            const collextras = this.state.collextras;
            const data = new FormData()
            data.append('name', this.state.collPic.name)
            data.append('file', this.state.collPic)
            const collPic = this.state.collPic;
            const blobpic = new Blob([collPic], {type:"image/jpg"});
            console.log(blobpic);
            const collcreator = getLocalStorage('userID');
            console.log(data);
            const uri = `/api/collections/new`;

            saxios.post(uri, {data, creatorID: collcreator, title: colltitle, Description:colldesc, extras: collextras})
            .then((resp)=>{
                alert(resp.data.Message);
                this.state.itemID = resp.data.insertId;
            })
            .catch((error)=>{
                alert(error);
            })

            saxios.put(`api/collections/newimage/${this.state.itemID}`, data)
            .then((resp)=>{
                console.log(resp);
            })
            .catch((error)=>{
                alert(error);
            })
        }
    }  

    handleFile = event=>{
        console.log(event.target.files[0]);
        this.state.collPic = event.target.files[0];
        console.log(this.state.collPic);
        
    }



    render(){
        return(
            <Page pageTitle="New Collection" auth={this.props.auth}>
                
                    <h2>Adding a new Collection!</h2>
                <Field
                name="colltitle"
                caption="Collection Title"
                value={this.state.colltitle}
                type="text"
                onChange={this.onChangeHandler}
                error={this.userNameError}
                />
                <Field
                name="colldesc"
                caption="Collection Description"
                value={this.state.colldesc}
                type="text"
                onChange={this.onChangeHandler}
                error={this.userEmailError}
                />
                <Field
                name="collextras"
                caption="Colllection Extras"
                value={this.state.collextras}
                type="text"
                onChange={this.onChangeHandler}
                error={this.userPassworderror}
                />
                <input type="file" onChange={this.handleFile} accept="jpg"></input>

                <Actions>
                    <button onClick={this.onClickAddCollection}>Add my Collection!</button>
                </Actions>

            </Page>
        )
    }




}