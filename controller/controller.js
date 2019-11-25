var express = require("express");
var router = express.Router();
var axios = require("axios");
var path = require("path");
var cheerio = require("cheerio");
//var request = require("request");

var Comment = require("../models/Comments");
var Article = require("../models/Articles");

router.get("/scrape", function( req, res){
    axios.get("https://www.theonion.com/")
    .then (function(response){
        var $ = cheerio.load(response.data);
        $("s").each(function(i, element){
            var result ={};

            result.title=$(this)
                .children("a")
                .text();
            
            result.link=$(this)
                .children("a")
                .attr("href")

            db.Article.create(result)
                .then(function(dbArticle){
                    console.log(dbArticle)
                })
                .catch(function(err){
                    console.log(err);
                });
        });
        res.send("The scrape is done")
    });
});

router.get("/articles", function(req, res){

})