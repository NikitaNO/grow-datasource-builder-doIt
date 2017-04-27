const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/close-window', (req, res) => {
  res.send('<script>window.close();</script>');
});

router.use('/', require('./dataSource'));

module.exports = router;
