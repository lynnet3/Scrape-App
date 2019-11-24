var express = require("express");
//var router = express.Router();
var axios = require("axios");
var path = require("path");
var cheerio = require("cheerio");
//var request = require("request");

var Comment = require("../models/Comments");
var Article = require("../models/Articles");

app.get("/scrape", function( req, res){
    axios.get("")
})