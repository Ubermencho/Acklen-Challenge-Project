import React, {Component} from 'react';
import Page from '../../Page';
import Field from '../../../Forms/Field';
import {Actions} from './../../../Forms/Button';
import {emptyRegex} from '../../../Forms/Validators';
import ReactCrop from 'react-image-crop';
import exif from 'exif-js';
import 'react-image-crop/dist/ReactCrop.css';

import {saxios, getLocalStorage} from '../../../Utilities/Utilities';
import {Redirect} from 'react-router-dom';

export default class NewCollection extends Component{
    constructor(){
        super();
        this.state={
            colltitle:'',
            colltitleerr:null,
            colldesc:'',
            colldescerr:null,
            collextras:'',
            collPic:null,
            itemID:0,
            src: null,
            crop: {
            unit: "%",
            width: 30,
            aspect: 1 / 1
            },
            croppedImageUrl: null,
            croppedUrl: null,
            redirect:false,
            
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
            const collPic =this.state.croppedUrl;
            const collcreator = getLocalStorage('userID');
            
            const uri = `/api/collections/new`;

            saxios.post(uri, {creatorID: collcreator, title: colltitle, Description:colldesc, Picture: collPic, extras: collextras})
            .then((resp)=>{
                alert(resp.data.Message);
                
            })
            .catch((error)=>{
                alert(error);
            })
            this.state.redirect = true;
        }
    }  

    handleFile = e => {
      const fileReader = new FileReader()
      fileReader.onloadend = () => {
        this.setState({ src: fileReader.result })
      }
      fileReader.readAsDataURL(e.target.files[0])
    }
  
    onImageLoaded = image => {
      this.imageRef = image
    }
  
    onCropChange = (crop) => {
      this.setState({ crop });
    }
  
    onCropComplete = crop => {
      if (this.imageRef && crop.width && crop.height) {
        const croppedImageUrl = this.getCroppedImg(this.imageRef, crop)
        this.setState({ croppedImageUrl })
      }
    }
  
    getCroppedImg(image, crop) {
      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");
  
  
      // --------
      const _this = this
      exif.getData(image, function(){
        var orientation = exif.getAllTags(this).Orientation;
  
        switch (orientation) {
          case 2:
            ctx.transform(-1, 0, 0, 1, crop.width, 0);
            break;
          case 3:
            ctx.transform(-1, 0, 0, -1, crop.width, crop.height);
            break;
          case 4:
            ctx.transform(1, 0, 0, -1, 0, crop.height);
            break;
          case 5:
            ctx.transform(0, 1, 1, 0, 0, 0);
            break;
          case 6:
            ctx.transform(0, 1, -1, 0, crop.height, 0);
            break;
          case 7:
            ctx.transform(0, -1, -1, 0, crop.height, crop.width);
            break;
          case 8:
            ctx.transform(0, -1, 1, 0, 0, crop.width);
            break;
          default:
            ctx.transform(1, 0, 0, 1, 0, 0);
        }
      
        //ctx.drawImage(img, 0, 0, img.width, img.height);
        //-----------
  
        ctx.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height
        )
  
        const reader = new FileReader()
        canvas.toBlob(blob => {
          reader.readAsDataURL(blob)
          reader.onloadend = () => {
            _this.dataURLtoFile(reader.result, 'cropped.jpg')
          }
        })
      }
    )
    }
  
    dataURLtoFile(dataurl, filename) {
      let arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
  
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      let croppedImage = new File([u8arr], filename, { type: mime });
      this.setState({ croppedImage: croppedImage, croppedUrl: dataurl })
      console.log(this.state.croppedUrl);
    }



    render(){
      const { crop, profile_pic, src, croppedUrl} = this.state
      if(this.state.redirect){
        return (<Redirect to="/collections"/>);
      }
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

                {src && (
                  <ReactCrop
                    src={src}
                    crop={crop}
                    onImageLoaded={this.onImageLoaded}
                    onComplete={this.onCropComplete}
                    onChange={this.onCropChange}
                  />
                )}
                {croppedUrl && (<img src={croppedUrl} />)}

                <Actions>
                    <button onClick={this.onClickAddCollection}>Add my Collection!</button>
                </Actions>

            </Page>
        )
    }




}