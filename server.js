// Using the tools and techniques you learned so far,
// you will scrape a website of your choice, then place the data
// in a MongoDB database. Be sure to make the database and collection
// before running this exercise.

// Consult the assignment files from earlier in class
// if you need a refresher on Cheerio.

// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var path = require("path");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "nhl";
var collections = ["nhlData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});


var results = []
// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "../public/view.html"));
});

// TODO: make two more routes

// Route 1
// =======
// This route will retrieve all of the data
app.get("/all", function (req, res) {
  db.nhlData.find({}, function (err, found) {
    if (err) throw err;
    res.json(found)
  });
 });
// from the scrapedData collection as a json (this will be populated
// by the data you scrape using the next route)

// Route 2

// =======
// When you visit this route, the server will
// scrape data from the site of your choice, and save it to
// MongoDB.
// TIP: Think back to how you pushed website data
// into an empty array in the last class. How do you
// push it into a MongoDB collection instead?

const clearData = () => db.nhlData.remove({});

const getData = function() {
  var titles = [];
var bodies = [];
 axios.get("https://www.nhl.com/news").then(function (response) {
   var $ = cheerio.load(response.data);

   $("div .article-item__preview").each(function(i, element) {
    var body = $(element).find("p").text();
    // var link = $(element).parent().attr("href");
    console.log(body)
   bodies.push({body:body});
    });

   $("div.article-item__top").each(function (i, element) {
     var title = $(element).find("h1").text();

     titles.push({title:title});
    // var body = $(element).children("h2").text();
    
   });

   for( var i=0; i<titles.length; i++){
    results.push({
        title: titles[i].title,
        body: bodies[i].body
    })
}
for (var i=0 ; i<results.length; i++){
  db.nhlData.insert({title: results[i].title, body: results[i].body},function(err,data){
      console.log(data)
    
  })
}

 });
}

app.get("/getdata", function (req, res) {
 getData();
 res.redirect("/all");
})

app.get("/delete",function(req,res){
  db.nhlData.remove({},function(err,data){
      res.json(data)
  })
})


/* -/-/-/-/-/-/-/-/-/-/-/-/- */

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});