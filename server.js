var express = require("express");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var logger = require("morgan")

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");
var PORT = process.env.PORT || 3000;

var app = express();

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(express.static("/public"));

mongoose.connect("mongodb://localhost/scrape-app", {
    useNewUrlParser: true
});

app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);

app.set("view engin", "handlebars");

app.listen(PORT, function(){
    console.log("Ready to run on " + PORT)
});