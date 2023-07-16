const express = require('express');
const router = express.Router();
const { register } = require('../middlewares/register.js');

router.post('/', register.add, function(req, res, next) {
  res.json(req.body);
});


module.exports = router;
