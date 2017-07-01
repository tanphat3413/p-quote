var express = require('express');
var router = express.Router();

var quoteController = require(__rootPath + '/controllers/quote_controller');
/* BEGIN */

router.get('/', quoteController.list);
router.get('/list_comp', quoteController.list_comp);
router.post('/form', quoteController.form);

router.get('/get_quote', quoteController.get_quote);

router.get('/claw_list', quoteController.claw_list);
router.post('/claw_list', quoteController.claw_list);

/* END */
module.exports = router;