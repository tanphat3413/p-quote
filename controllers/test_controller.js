
var _ = require('underscore');
var s = require('string');
var path = require('path');

var fn = require(__rootPath + '/lib/function');

const model = require(__rootPath + '/config/config_db');
const db = model.db;
const refTable = model.refTable;

exports.index = (req, res) => {
	if (req.session.views) {
		req.session.views++;
		res.setHeader('Content-Type', 'text/html');
		res.write('<p>views: ' + req.session.views + '</p>');
		res.end();
	} else {
		req.session.views = 1;
		res.end('Welcome to the file session demo. Refresh page!');
	}
}