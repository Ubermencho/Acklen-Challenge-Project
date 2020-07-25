import React, {Component} from 'react';
import Page from '../../Page';
import Field from '../../../Forms/Field';
import {Actions} from './../../../Forms/Button';
import {emptyRegex} from '../../../Forms/Validators';
import ReactCrop from 'react-image-crop';
import exif from 'exif-js';
import 'react-image-crop/dist/ReactCrop.css';

import {saxios, getLocalStorage, removeLocalStorage} from '../../../Utilities/Utilities';
import {Redirect} from 'react-router-dom';

export default class NewItem extends Component{
    constructor(){
        super();
        this.state={
            itemName:'',
            itemNameerr:null,
            itemDescription:'',
            itemDescriptionerr:null,
            itemValue:0,
            itemCondition:'',
            itemPic:null,
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
        this.onClickAddItem = this.onClickAddItem.bind(this);
    }



    validate() {
        let nameErrors = null;
        let tmpErrors = [];
        const name = this.state.itemName;
        const description = this.state.itemDescription;
        const condition = this.state.itemCondition;
        if (name !== undefined) {
          if (emptyRegex.test(name)) {
            tmpErrors.push("Please enter a Name");
          }
          if (tmpErrors.length) {
            nameErrors = Object.assign({}, nameErrors, { NameError: tmpErrors.join('. ') });
            alert(nameErrors.NameError);
          }
        }
        if (description !== undefined) {
          tmpErrors = [];
          if ((emptyRegex.test(description))) {
            tmpErrors.push("Please enter a Description");
          }
          if (tmpErrors.length) {
            nameErrors = Object.assign({}, nameErrors, { descriptionError: tmpErrors.join('. ') });
            alert(nameErrors.descriptionError);
          }
        }
        if (condition !== undefined) {
            tmpErrors = [];
            if ((emptyRegex.test(condition))) {
              tmpErrors.push("Please enter a Condition");
            }
            if (tmpErrors.length) {
              nameErrors = Object.assign({}, nameErrors, { conditionError: tmpErrors.join('. ') });
              alert(nameErrors.conditionError);
            }
          }
        
        
        return nameErrors;
      }

    onChangeHandler(e) {
        const { name, value } = e.currentTarget;
        
        this.setState({...this.state,[name]: value,});
      }


    onClickAddItem(e){
        e.preventDefault();
        e.stopPropagation();
        const errors = this.validate();
        if (errors) {
          this.setState({ ...this.state, ...errors });
        }else{
            const itemName = this.state.itemName;
            const itemDescription = this.state.itemDescription;
            const itemValue = this.state.itemValue;
            const itemCondition = this.state.itemCondition
            const collPic =this.state.croppedUrl;
            const collID = getLocalStorage('collID');
            
            const uri = `/api/collections/item/new`;

            saxios.post(uri, {collectionid: collID, itemname: itemName, description:itemDescription, picture: collPic, itemvalue: itemValue, condition:itemCondition})
            .then((resp)=>{
                alert(resp.data.Message);
                this.setState({...this.state, redirect: true });
            })
            .catch((error)=>{
                alert(error);
            })
            
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
    }



    render(){
      const { crop, profile_pic, src, croppedUrl} = this.state
      if(this.state.redirect){
        const redirect = (this.props.location.state) ? this.props.location.state.from.pathname : `/collections/${getLocalStorage('collID')}`;
        removeLocalStorage('collID');
        return (<Redirect to={redirect}/>);
      }
        return(
            <Page pageTitle="Adding a new Item" auth={this.props.auth}>
                
                    <h2>Adding a new Item to the Collection!</h2>
                <Field
                name="itemName"
                caption="Item Name"
                value={this.state.itemName}
                type="text"
                onChange={this.onChangeHandler}
                error={this.itemNameError}
                />
                <Field
                name="itemDescription"
                caption="Item's Description"
                value={this.state.itemDescription}
                type="text"
                onChange={this.onChangeHandler}
                error={this.itemDescriptionError}
                />
                <Field
                name="itemValue"
                caption="Item's Value"
                value={this.state.itemValue}
                type="number"
                onChange={this.onChangeHandler}
                error={this.itemValueerror}
                />
                <Field
                name="itemCondition"
                caption="Item's Condition"
                value={this.state.itemCondition}
                type="text"
                onChange={this.onChangeHandler}
                error={this.itemConditionerror}
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
                    <button onClick={this.onClickAddItem}>Add my Item!</button>
                </Actions>

            </Page>
        )
    }




}