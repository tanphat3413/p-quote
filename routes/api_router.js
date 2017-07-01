var express = require('express');
var router = express.Router();

var quoteController = require(__rootPath + '/controllers/quote_controller');
/* BEGIN */
router.get('/quote', quoteController.get_quote);

/* END */
module.exports = router;