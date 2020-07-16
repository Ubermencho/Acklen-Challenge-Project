var express = require('express');

var router = express.Router();
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "usercollectiontracker",
    password: "collectiontracker",
     database: "collectiontrackerdb"
});


    //http://localhost:5000/api/user/new
    router.post('/new', (req,res)=>{
        var userEmail = req.body.email;
        var userPassword = req.body.pass;
        var userName = req.body.name;

        let sql = `insert ignore into users (userName, userEmail, userPassword) values ('${userName}', '${userEmail}', MD5('${userPassword}'));`;
        con.query(sql, function(err, result){
            if(err) throw err;
            if(result.affectedRows==0){
                res.send("There is already a user under that email!");
            }else{
                res.send("Success!");
            }
            
        });
    });


module.exports = router;