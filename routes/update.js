const express = require('express');
const router = express.Router();
const { update } = require('../middlewares/update.js');

router.post('/userTasks', update.userTasks, function(req, res, next) {
  res.json(req.body);
});


module.exports = router;
