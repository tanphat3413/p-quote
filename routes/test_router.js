var express = require('express');
var router = express.Router();

var fn = require(__rootPath + '/lib/function');

var testController = require(__rootPath + '/controllers/test_controller');

router.get('/', testController.index);


module.exports = router;