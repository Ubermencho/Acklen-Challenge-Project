var express = require('express');

var router = express.Router();
const multer = require("multer");

var mysql = require('mysql');
var fs = require("fs");
const { off } = require('../../../app');

var con = mysql.createConnection({
    host: "localhost",
    user: "usercollectiontracker",
    password: "collectiontracker",
     database: "collectiontrackerdb"
});

const upload = multer();
    //http://localhost/api/collections/new
    router.post('/new',  (req,res)=>{
        var creatorID = req.body.creatorID;
        var title = req.body.title;
        var Description = req.body.Description;
        var extras = req.body.extras;
  
        let sql = `insert into collections (creatorID, title, Description, extras, state) values (${creatorID}, '${title}', '${Description}', '${extras}', 1);`;

         con.query(sql, function(err, result){
            if (err) throw err;
            console.log(result.insertId);
            if(result.affectedRows==0){
                res.send({Message:"There was an error..."})
                
            }else{
                res.send({Message:"Success!", insertId:result.insertId});
            }
         })
         //console.log(results);
         
    });

    //http://localhost/api/collections/newimage
    router.put('/newimage/:itemid', upload.single('file'), function (req,res, next){
        var itemid = req.params.itemid;
        console.log(req.file);
        var blobimg = new Blob(req.file);

        let sql= `update collections set Picture = '${blobimg}' where collectionID =${itemid};`

        con.query(sql,function(err, result){
            if(err) throw err;
            res.send(result);
        })
 
    });

    //http://localhost:5000/api/collecctions/all/:id/:offset/:items
    router.get('/all/:id/:offset/:items', (req,res)=>{
        var userID = parseInt(req.params.id);
        var offset= parseInt(req.params.offset);
        var itemsToLoad =  parseInt(req.params.items);
        let sql  = `select * from collections where creatorID = ${userID} order by collectionID LIMIT ${itemsToLoad} OFFSET ${offset};`;

        con.query(sql, function(err, result){
            if(err) throw err;
                res.send(result);
            
        });
        
    });

    //http://localhost:5000/api/collections/detail/:id/:offset/:items
    router.get('/detail/:id/:offset/:items', (req,res)=>{
        var collectionID = parseInt(req.params.id);
        var offset = parseInt(req.params.offset);
        var itemsToload = parseInt(req.params.items);

        let sql = `select * from items where collectionID = ${collectionID} order by itemID LIMIT ${itemsToload} OFFSET ${offset};`;

        con.query(sql, function(err, results){
            if(err) throw err;
            if(!results[0]){
                res.send("not found");
            }else{
                res.send(results);
            }
        });
    });

    //http://localhost:5000/api/collections/items/new
    router.post('/item/new', (req, res)=>{
        var itemName = req.body.itemname;
        var description = req.body.description;
        var value = parseFloat(req.body.itemvalue);
        var condition = req.body.condition;
        var picture = req.body.picture;
        var collectionID = req.body.collectionid;

        let sql = `insert into items (itemName, itemDescription, itemValue, itemCondition, picture, collectionID) values ('${itemName}', '${description}', ${value}, '${condition}', '${picture}', ${collectionID});`;

        con.query(sql, function(err, result){
            if(err) throw err;
            if(result.affectedRows==0){
                res.send("There was an error adding the item!");
            }else{
                res.send("Item added successfully!");
            }
        });
    });

    //http://localhost:5000/api/collections/item/upd/:id
    router.put('/item/upd/:id', (req,res)=>{
        var itemid = req.params.id;
        var itemName = req.body.itemname;
        var description = req.body.description;
        var value = parseFloat(req.body.itemvalue);
        var condition = req.body.condition;
        var picture = req.body.picture; 

        let sql = `update items set itemName='${itemName}', itemDescription='${description}', itemValue=${value}, itemCondition='${condition}', picture='${picture}' where itemID = ${itemid};`;

        con.query(sql, function(err, result){
            if(err) throw err;

            if(result.affectedRows==0){
                res.send("There was an error updating the item!");
            }else{
                res.send("Item updated successfully!");
            }
        });
    });

    //http://localhost:5000/api/collections/item/del/:id
    router.delete('/item/del/:id', (req,res)=>{
        var itemid = req.params.id;

        let sql = `delete from items where itemID=${itemid};`;

        con.query(sql, function(err, result){
            if(err) throw err;
            if(result.affectedRows==0){
                res.send("There was an error deleting the item!");
            }else{
                res.send("Item deleted successfully!");
            }
        });
    });

    //http://localhost:5000/api/collections/unlist/:id
    router.put('/unlist/:id', (req,res)=>{
        var collectionid = req.params.id;
        const state={state:0};

        let sql = `update collections set state=0 where collectionID=${collectionid};`;
        con.query(sql, function(err, result){
            if(err) throw err;
            if(result.affectedRows==0){
                res.send("There was an error unlisting the collection!")
            }else{
                res.send("Collection unlisted successfully!");
            }
        });
  
    });

    //http://localhost:5000/api/collections/relist/:id
    router.put('/relist/:id', (req,res)=>{
        var collectionid = req.params.id;
        const state={state:0};

        let sql = `update collections set state=1 where collectionID=${collectionid};`;
        con.query(sql, function(err, result){
            if(err) throw err;
            if(result.affectedRows==0){
                res.send("There was an error relisting the collection!")
            }else{
                res.send("Collection relisted successfully!");
            }
        });
  
    });

module.exports = router;