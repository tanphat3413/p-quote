var express = require('express');
var router = express.Router();

var apiController = require(__rootPath + '/controllers/api_controller');
/* BEGIN */
router.get('/quote', apiController.quote);

/* END */
module.exports = router;