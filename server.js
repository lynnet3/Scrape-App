var express = require("express");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var logger = require("morgan")

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");
var PORT = process.env.PORT || 3000;

var app = express();

app.use(logger("dev"));

app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrape-app";

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true
});

app.get("/scrape", function (req, res) {
    axios.get("https://www.theonion.com").then(function(response){

    var $ = cheerio.load(response.data);

    $("content-meta__headline__wrapper sc174gvm-0 eYcrcn").each(function (i, element) {
            var result = {};

            result.title = $(this)
                .children("a")
                .text();
           
            result.link = $(this)
                .children("a")
                .attr("href")

            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle)
                })
                .catch(function (err) {
                    console.log(err);
                });
        });
        res.send("The scrape is done");
        });
});

app.get("/articles", function(req, res){
    db.Article.find({})
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    });
});

app.get("/articles/:id", function(req, res){
    db.Article.findOne({_id: req.perams.id})
    .populate("comment")
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    });
});

app.post("/articles/:id", function(req, res){
    db.Ccomment.create(req.body)
    .then(function(dbComment){
        return db.Article.findOneAndUpdate({_id: req.perams.id}, {comment: dbComment._id}, {new: true});
    })
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    });
});
// app.engine(
//     "handlebars",
//     exphbs({
//         defaultLayout: "main"
//     })
// );

// app.set("view engin", "handlebars");

//require("./controller/controller")(app);
app.listen(PORT, function () {
    console.log("Ready to run on localhost:"+PORT)
});