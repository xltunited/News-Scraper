/* Scraping into DB (18.2.5)
 * ========================== */

// Initialize Express app
var express = require('express');
var app = express();

// Require request and cheerio. This makes the scraping possible
var request = require('request');
var cheerio = require('cheerio');

// Database configuration
var mongoose = require("mongoose");
var logger = require("morgan");

// Handlebars and Path

var exphbs = require("express-handlebars");
var path = require("path");

// Dependencies
var bodyParser = require("body-parser");


// Initialize Express
var app = express();

// MIDDLEWARE
app.set("views", __dirname + "/views");
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:"application/vnd.api+json"}));

// Mongoose mpromise deprecated - use bluebird promises
var Promise = require("bluebird");

mongoose.Promise = Promise;

// Bring in our Model for the news article
var Article = require("./schemas/articleSchema.js");

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));


// Database configuration with mongoose
mongoose.connect("mongodb://localhost/news");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Routes
// ======

// Simple index route
app.get("/", function(req, res) {
  res.redirect("/home");
});

app.get("/home", function(req, res) {
  
  res.render("home");

});

app.get("/article", function(req, res) {
  
  res.render("home");

});

// This GET route handles the creation of a new book in our mongodb article collection
app.get("/scrape", function(req, res) {

  request('http://www.npr.org/', function(error, response, html) {
    // load the html body from request into cheerio
    var $ = cheerio.load(html);
    // for each element with a "title" class
    $('.hp-item').each(function(i, element) {
      // save the image in the current element
      var imgLink = $(".img").attr('src');
      // save the title value of each link enclosed in the current element
      var title = $(".title").text();

      var titleLink = $(".story-text").children('a').attr('href');

      var story = $(".teaser").text();

      // if this title element had both a title and a link
      if (imgLink && title && titleLink && story) {

        var news = {

          title: title,
          story:story,
          link:titleLink,
          imgLink:imgLink,
          comments:[]

        }
        
        var content = new Article(news);

        content.save(function(error, doc) {
          // Send any errors to the browser
          if (error) {
            res.send(error);
          }

        });

      }

    });

  });

  // // this will send a "search complete" message to the browser
  res.send("Scrape Complete");

});

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});