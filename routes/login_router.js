var express = require('express');
var router = express.Router();

var loginController = require(__rootPath + '/controllers/login_controller');

/* BEGIN */

router.get('/', loginController.login);
router.post('/', loginController.postLogin);

/* END */
module.exports = router;