var express = require('express');

var router = express.Router();

var mysql = require('mysql');
const { off } = require('../../../app');

var con = mysql.createConnection({
    host: "localhost",
    user: "usercollectiontracker",
    password: "collectiontracker",
     database: "collectiontrackerdb"
});


    //http://localhost/api/collections/new
    router.post('/new', (req,res)=>{
        var creatorID = req.body.creatorID;
        var title = req.body.title;
        var Description = req.body.Description;
        var Picture = req.body.Picture;
        var extras = req.body.extras;

        let sql = `insert into collections (creatorID, title, Description, Picture, extras, state) values (${creatorID}, '${title}', '${Description}', '${Picture}', '${extras}', 1);`;

         con.query(sql, function(err, result){
            if (err) throw err;

            if(result.affectedRows==0){
                res.send("Something went wrong...");
            }else{
                res.send("Success!");
            }
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
            if(!result[0]){
                res.send("nothing found!");
            }else{
                res.send(result);
            }
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

module.exports = router;