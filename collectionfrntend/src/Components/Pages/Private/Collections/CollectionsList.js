import React, {Component} from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import {Link} from 'react-router-dom';
import {IoIosInformationCircleOutline, IoIosAdd, IoIosAddCircleOutline, IoMdRemove} from 'react-icons/io';
import {getLocalStorage} from '../../../Utilities/Utilities'

import Page from '../../Page';
import './CollectionList.css';
import {saxios} from '../../../Utilities/Utilities';

export default class Collections extends Component{
    constructor(){
        super();
        this.state={
            results:[],
            hasMore:true,
            offset:0,
            itemsToLoad:10,
            base:"adasd"
        }
        this.loadMore = this.loadMore.bind(this);
    }

    loadMore(){
        const items = this.state.itemsToLoad;
        const userID = getLocalStorage('userID');
        const uri = `/api/collections/all/${parseInt(userID)}/${parseInt(this.state.offset)}/${items}`;

        saxios.get(uri)
        .then(
            ({data})=>{
                const apiItems = data;
                console.log(apiItems);
                const total = data.length;
                const loadedItems = this.state.results;
                apiItems.map((e)=>loadedItems.push(e));
                this.state.offset += items;
                if(total){
                    this.setState({
                        'results':loadedItems,
                        'hasMore': true
                    });
                }else{
                    this.setState({'hasMore':false});
                }
            }
        )
        .catch((error)=>{
            console.log(error);
          })
    }

 
    render(){
        const uiItems = this.state.results.map(
            (item)=>{
                console.log(item.Picture);
                var blob = new Blob(item.Picture.data);
                var base64Image = new Buffer(item.Picture, 'binary').toString('base64');
                console.log(base64Image);
                var source = "data: image/jpeg;base64," + base64Image;
                return(
                    <div className="listItem" key={parseInt(item.collectionID)}>
                        <img className="image" src={source}></img>
                        <span>{item.title}</span>
                        <span>{item.Description}</span>
                        <span>{item.extras}</span>
                        <span><IoIosInformationCircleOutline></IoIosInformationCircleOutline></span>
                    </div>
                );
            }
        );
        if(!uiItems.length) uiItems.push(
            <div key="pbListAddOne">
                <span>Nuevo Item</span>
            </div>
        )

        return(
            <Page pageTitle="Your Collections" auth={this.props.auth}>
                <div ref={(ref)=>this.scrollParentRef = ref}>
                    <h2>Your Collections!</h2>
                    <p className="addnew"><IoIosAddCircleOutline></IoIosAddCircleOutline>Add a new Item</p>
                    <InfiniteScroll
                    pageStart={0}
                    loadMore={this.loadMore}
                    hasMore={this.state.hasMore}
                    threshold={108}
                    getScrollParent={()=>this.scrollParentRef}
                    loader={<div key="pbListLoading" key={0}>Loading Collections...</div>}
                    >
                        {uiItems}
                    </InfiniteScroll>
                </div>
            </Page>
        )
    }
}