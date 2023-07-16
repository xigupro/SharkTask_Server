const express = require('express');
const router = express.Router();
const { login } = require('../middlewares/login.js');
const { favorite } = require('../middlewares/favorite.js');

router.post('/list', login.check, favorite.list, function(req, res, next) {
  res.json(req.body);
});

router.post('/add', login.check, favorite.add, function(req, res, next) {
  res.json(req.body);
});

router.post('/remove', login.check, favorite.remove, function(req, res, next) {
  res.json(req.body);
});

router.post('/isFavorite', login.check, favorite.isFavorite, function(req, res, next) {
  res.json(req.body);
});


module.exports = router;
