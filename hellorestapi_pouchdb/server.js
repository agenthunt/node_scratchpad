// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express'); // call express
var app = express(); // define our app using express


var PouchDB = require('pouchdb');
var db = new PouchDB('bearsdb');

var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
  // do logging
  console.log('Something is happening.');
  next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  res.json({
    message: 'hooray! welcome to our api!'
  });
});

// more routes for our API will happen here
// on routes that end in /bears
// ----------------------------------------------------
router.route('/bears')
  // create a bear (accessed at POST http://localhost:8080/api/bears)
  .post(function(req, res) {
    var name = req.body.name;
    var bear = {
      name: name,
      _id: new Date().toISOString(),
    };
    db.put(bear, function(err, result) {
      if(err)
        res.send(err);

      res.json({
        message: 'Bear created!'
      });
    });

  })

.get(function(req, res) {
  db.allDocs({
    include_docs: true,
    descending: true
  }, function(err, doc) {
    if(err)
      res.send(err);

    res.json(doc.rows);
  });
});

//on routes that end in /bears/:bear_id
//----------------------------------------------------
router.route('/bears/:bear_id')

// get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
.get(function(req, res) {
    db.get(req.params.bear_id, function(err, bear) {
      if(err)
        res.send(err);

      res.json(bear);
    });
  })
  // update the bear with this id (accessed at PUT http://localhost:8080/api/bears/:bear_id)
  .put(function(req, res) {

    // use our bear model to find the bear we want
    db.get(req.params.bear_id, function(err, bear) {

      if(err) {
        res.send(err);
      } else {

        bear.name = req.body.name; // update the bears info

        // save the bear
        db.put(bear, function(err) {
          if(err)
            res.send(err);

          res.json({
            message: 'Bear updated!'
          });
        });
      }

    });
  }) // delete the bear with this id (accessed at DELETE http://localhost:8080/api/bears/:bear_id)
  .delete(function(req, res) {
    db.get(req.params.bear_id, function(err, doc) {
      db.remove(doc, function(err, bear) {
        if(err)
          res.send(err);

        res.json({
          message: 'Successfully deleted'
        });
      });
    });
  });


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
