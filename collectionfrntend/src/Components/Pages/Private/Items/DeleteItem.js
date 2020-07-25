import React, {Component} from 'react';
import Page from '../../Page';
import {Actions} from '../../../Forms/Button';

import {saxios, getLocalStorage, removeLocalStorage} from '../../../Utilities/Utilities';
import {Redirect} from 'react-router-dom';

export default class DeleteItem extends Component{
    constructor(){
        super();
        this.state={
            collID:0,
            redirect:false
        }
        this.redirecttoCollection = this.redirecttoCollection.bind(this);
        this.DeleteItem = this.DeleteItem.bind(this);
    }

    redirecttoCollection(){
        var collid= getLocalStorage('collID');
        this.setState({'collID':collid, 'redirect':true});
    }

    DeleteItem(){
        var itemID =this.props.match.params.id;
        const uri=`/api/collections/item/del/${itemID}`;
        saxios.delete(uri)
        .then((resp)=>{
            alert(resp.data.Message);
            this.setState({...this.state, collID:getLocalStorage('collID'),redirect: true });
            removeLocalStorage('collID');
        }).catch((error)=>{
            alert(error);
        })

    }

    render(){
        if(this.state.redirect){
            const redirect = (this.props.location.state) ? this.props.location.state.from.pathname : `/collections/${this.state.collID}`;
           
            return (<Redirect to={redirect}/>);
          }

        return(
            <Page pageTitle="Deleting an Item" auth={this.props.auth}>
                <h2>ALERT! DELETING AN ITEM IS PERMANENT, DO YOU STILL WISH TO DELETE THIS ITEM?</h2>
                <Actions>
                    <button onClick={this.DeleteItem}>Delete it!</button>
                    <button onClick={this.redirecttoCollection}>Don't Delete it!</button>
                </Actions>
            </Page>
        );
    }
}