const _ = require('underscore');
const s = require('string');
const path = require('path');
const logger = require(__rootPath + '/lib/logger');

const constVar = require(__rootPath + '/config/const');
const fn = require(__rootPath + '/lib/function');
const authHelper = require(__rootPath + '/lib/auth_helper');

const model = require(__rootPath + '/config/config_db');
const db = model.db;
const refTable = model.refTable;

var viewPath = 'api/';

exports.quote = ((req, res) => {
	var type = fn.element(req.query, 'type', 'json').toLowerCase();
	if (['json', 'html', 'text'].indexOf(type) == -1) {
		type = 'json';
	}
	new Promise((resolve, reject) => {
		//get ids
		db.ref(fn.jup(refTable.refQuoteIDs, 'ids')).once('value').then((snapIDs) =>{
			
			var strIDs = snapIDs.val();
			if(!strIDs){
				resolve({});				
			} else {
				var ids = strIDs.split(',');
				var minIndex = 0, 
					maxIndex = ids.length-1;
				var randIndex = Math.floor((Math.random() * (maxIndex-minIndex)) + minIndex);
				if(randIndex > maxIndex){
					randIndex = maxIndex;
				}
				var id = ids[randIndex];
				
				db.ref(fn.jup(refTable.refQuotes, id)).once('value').then((snapQuote) =>{
					resolve(snapQuote.val());
				});
			}
		})

	}).then((quote) => {

		switch (type) {
			case 'json':
				res.json(fn.jsonResult(true, '', quote));
				break;

			case 'html':
				res.render(viewPath + 'quote/quote', {
					quote: quote
				});
				break;
		}
	}).catch((err) => {
		logger.error(err);
		res.json(fn.jsonResult(false, 'ERROR', err));
	});

})