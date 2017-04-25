const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.use('/', require('./dataSource'));

module.exports = router;
