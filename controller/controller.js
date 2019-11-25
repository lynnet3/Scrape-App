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

            Article.create(result)
                .then(function(Article){
                    console.log(Article)
                })
                .catch(function(err){
                    console.log(err);
                });
        });
        res.send("The scrape is done")
    });
});

router.get("/articles", function(req, res){
    Article.find()
    .sort({_id: -1})
    .exec(function(err,doc){
        if (err){
            console.log(err);
        }else{
            var artc ={article: doc};
            res.render("index", artc);
        }
    });
});

router.get("/clearAll", function(req, res) {
    Article.remove({}, function(err, doc) {
      if (err) {
        console.log(err);
      } else {
        console.log("removed all articles");
      }
    });
    res.redirect("/articles-json");
  });
  
  router.get("/readArticle/:id", function(req, res) {
    var articleId = req.params.id;
    var hbsObj = {
      article: [],
      body: []
    };
  
    Article.findOne({ _id: articleId })
      .populate("comment")
      .exec(function(err, doc) {
        if (err) {
          console.log("Error: " + err);
        } else {
          hbsObj.article = doc;
          var link = doc.link;
          request(link, function(error, response, html) {
            var $ = cheerio.load(html);
  
            $(".l-col__main").each(function(i, element) {
              hbsObj.body = $(this)
                .children(".c-entry-content")
                .children("p")
                .text();
  
              res.render("article", hbsObj);
              return false;
            });
          });
        }
      });
  });
  router.post("/comment/:id", function(req, res) {
    var user = req.body.name;
    var content = req.body.comment;
    var articleId = req.params.id;
  
    var commentObj = {
      name: user,
      body: content
    };
  
    var newComment = new Comment(commentObj);
  
    newComment.save(function(err, doc) {
      if (err) {
        console.log(err);
      } else {
        console.log(doc._id);
        console.log(articleId);
  
        Article.findOneAndUpdate(
          { _id: req.params.id },
          { $push: { comment: doc._id } },
          { new: true }
        ).exec(function(err, doc) {
          if (err) {
            console.log(err);
          } else {
            res.redirect("/readArticle/" + articleId);
          }
        });
      }
    });
  });
  
  module.exports = router;