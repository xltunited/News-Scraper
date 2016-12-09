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



/* Showing Mongoose's "Populated" Method (18.3.6)
 * INSTRUCTOR ONLY
 * =============================================== */

// Dependencies
var bodyParser = require("body-parser");

// Mongoose mpromise deprecated - use bluebird promises
var Promise = require("bluebird");

mongoose.Promise = Promise;

// Bring in our Model for the news article
var Article = require("./schemas/articleSchema.js");

// Initialize Express
var app = express();

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
  res.send("<h1>Hi!</h1>");
});


// This GET route handles the creation of a new book in our mongodb books collection
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
          // Otherwise, send the new doc to the browser
        });

      }

    });

  });

  // // this will send a "search complete" message to the browser
  res.send("Scrape Complete");

});


// This GET route let's us see the books we have added
app.get("/books", function(req, res) {
  // Using our Book model, "find" every book in our book db
  article.find({}, function(error, doc) {
    // Send any errors to the browser
    if (error) {
      res.send(error);
    }
    // Or send the doc to the browser
    else {
      res.send(doc);
    }
  });
});

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});