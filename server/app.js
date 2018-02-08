var express = require('express');
var morgan = require('morgan');
var axios = require('axios');
var encode = encodeURIComponent;
var app = express();
var cache = {};

app.use(morgan('dev'));

app.get('/', function(req,res){
    let param = null;
    let key = null;

    if(req.query.hasOwnProperty('i')){
        key = req.query.i;
        param = 'i=' + encode(key);
    } else if (req.query.hasOwnProperty('t')){
        key = req.query.t;
        param = 't=' + encode(key);
    }
    if(cache.hasOwnProperty(key)){
        res.json(cache[key]);
        console.log('Something is in your cache');
    } else {
        console.log('http://www.omdbapi.com/?apikey=8730e0e&' + param);
        axios.get('http://www.omdbapi.com/?apikey=8730e0e&' + param)
        .then(function(response){
            cache[key] = response.data;
            res.json(cache[key]);
        })
        .catch(function(error){
        console.log('Oh no, something went wrong!',error);
        res.status(500).send(error.message)
     });
    };

   });

app.get('/data', function(req,res){
    res.json(cache);
})

module.exports = app;