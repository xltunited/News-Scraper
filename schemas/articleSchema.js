

// First, we hook mongoose into the model with a require
var mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost/news");

autoIncrement.initialize(connection);

// Then, we save the mongoose.Schema class as simply "Schema"
var Schema = mongoose.Schema;

// With our new Schema class, we instantiate an articleSchema object
// This is where we decide how our data must look before we accept it in the server, and how to format it in mongoDB
var articleSchema = new Schema({
  // string must be a string. We "trim" it to remove any trailing white space
  // Notice that it is required, as well. It must be entered or else mongoose will throw an error
  title: {
    type: String,
    trim: true,
    required: "String is Required"
  },
  story: {
    type: String,
    trim: true,
    required: "String is Required"
  },
  link: {
    type: String,
    trim: true,
    required: "String is Required"
  },
  imgLink: {
    type: String,
    trim: true,
    required: "String is Required"
  },
  comments: Array
});

articleSchema.plugin(autoIncrement.plugin, 'Article');

// This creates our model from the above schema, using mongoose's model method
var article = mongoose.model("Article", articleSchema);

// Finally, we export the module, allowing server.js to hook into it with a require statement
module.exports = article;
