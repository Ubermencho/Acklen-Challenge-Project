import React, {Component} from 'react';
import Page from '../../Page';
import {Redirect, Link} from 'react-router-dom';
import {saxios} from '../../../Utilities/Utilities';
import InfiniteScroll from 'react-infinite-scroller';
import { IoIosAddCircleOutline } from 'react-icons/io';

export default class CollectionDetail extends Component{
    constructor(){
        super();
        this.state={
            results:[],
            hasMore:true,
            offset:0,
            itemsToLoad:10
        }
        this.loadMore = this.loadMore.bind(this);
    }

    loadMore(){
        const items = this.state.itemsToLoad;
        const collectionID = this.props.match.params.id;
        const uri = `/api/collections/detail/${collectionID}/${this.state.offset}/${items}`;
        
        saxios.get(uri)
        .then(
            ({data})=>{
                const apiItems = data;
                const total = data.length;
                const loadedItems = this.state.results;
                apiItems.map((e)=>loadedItems.push(e));
                this.state.offset += items;
                if(total){
                    this.setState({'results': loadedItems, 'hasMore':true});
                }else{
                    this.setState({'hasMore':false});
                }
            }
        ).catch((error)=>{
            console.log(error);
        })
        }

    render(){
        const uiItems = this.state.results.map(
            (item)=>{
                return(
                    <div className="listItem" key={parseInt(item.itemID)}>
                        <img className="image" src={item.picture}></img>
                        <span>Name: {item.itemName}</span>
                        <span>Description: {item.itemDescription}</span>
                        <span>Value: {item.itemValue}</span>
                        <span>Condition: {item.itemCondition}</span>
                    </div>
                );
            }
        );
        return(
            <Page pageTitle="Collection's Detail" auth={this.props.auth}>
                <div ref={(ref)=>this.scrollParentRef = ref}>
                        <h2>Items in this Collection</h2>
                        <Link ><button className="addnew"><IoIosAddCircleOutline size="2em"/>Add a new Item to this collection</button></Link>
                        <InfiniteScroll
                        pageStart={0}
                        loadMore={this.loadMore}
                        hasMore={this.state.hasMore}
                        threshold={108}
                        getScrollParent={()=>this.scrollParentRef}
                        loader={<div key="pblistLoading" key={0}>Loading Items...</div>}
                        >
                            {uiItems}
                        </InfiniteScroll>
                </div>
            </Page>   
        )
    }
}