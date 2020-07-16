var express = require('express');
var router = express.Router();

function initApi(){
    var collectionsRouter = require('./collections/collections.js');
    var userRouter = require('./user/user.js');

    router.use('/user', userRouter);

    return router;
}

module.exports = initApi;