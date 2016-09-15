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

router.post('/poll/:pollId/vote/:optionId', function(req, res, next) {
  if (!req.cookies.uid) {
    var token = require('crypto').randomBytes(64).toString('hex');
  }

  var vote = {
    id: null,
    cookieid: req.cookies.uid || token,
    poll_id: req.params.pollId,
    option_id: req.params.optionId,
    timestamp: new Date()
  };

  dbService.votes.insert(objectHelper.convertToRaw.vote(vote)).then(function() {
    res.status(200).send();
  }).catch(function(err) {
    logger.error(err.message);
    res.status(400).send();
  });
});

router.post('/poll/:pollId/newOption/:option', function(req, res, next) {
  var pollOption = {
    id: null,
    text: req.params.option,
    poll_id: req.params.pollId
  };

  dbService.pollOptions.insert(objectHelper.convertToRaw.pollOption(pollOption)).then(function() {
    res.status(200).send();
  }).catch(function(err) {
    logger.error(err.message);
    res.status(400).send();
  });
});

router.get('/poll/:pollId', function(req, res, next) {
  dbService.poll.getPopulated(req.params.pollId).then(function(poll) {
    res.render('poll', {
      poll: poll
    });
  }).catch(function(err) {
    logger.warn(err.message);
    res.redirect('/');
  });
});

router.get('/api/poll/:pollId', function(req, res, next) {
  dbService.poll.getPopulated(req.params.pollId).then(function(poll) {
    res.json(poll);
  }).catch(function(err) {
    logger.warn(err.message);
    res.status(400).json({
      error: err.message
    })
  });
});

module.exports = router;