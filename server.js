var express = require("express");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");
var PORT = process.env.PORT || 3000;

var app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/scrape-app", {useNewUrlParser: true});

app.get("/scrape", function(req.res){
    axios.get("some website").then(function(response){
        var $ = cheerio.load(response.data);

        $("the thing to grab").each(function(i, element){
            var result = {};

            
        })
    })
})