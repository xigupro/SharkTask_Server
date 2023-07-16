const express = require('express');
const router = express.Router();
const { log } = require('../middlewares/log.js');

router.post('/list', log.list, function(req, res, next) {
  res.json(req.body);
});
module.exports = router;
