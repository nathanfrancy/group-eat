var express = require('express');
var router = express.Router();

var logger = require('comb').logger('ge.routes');

var services = require('./../services');
var dbService = services.database;

var helpers = require('./../helpers');
var objectHelper = helpers.object;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/poll/create', function(req, res, next) {
  dbService.poll.insert(objectHelper.convertToRaw.poll(req.body)).then(function(id) {
    res.status(200).json({
      id: id
    });
  }).catch(function(err) {
    logger.error(err.message);
    res.status(400).send();
  });
});

router.get('/poll/:pollId', function(req, res, next) {
  dbService.poll.getPopulated(req.params.pollId).then(function(poll) {
    res.status(200).json(poll);
  }).catch(function(err) {
    logger.warn(err.message);
    res.status(400).json("Error getting this poll.");
  });
});

module.exports = router;