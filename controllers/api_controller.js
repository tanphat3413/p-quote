const _ = require('underscore');
const s = require('string');
const path = require('path');

const constVar = require(__rootPath + '/config/const');
const fn = require(__rootPath + '/lib/function');
const authHelper = require(__rootPath + '/lib/auth_helper');

const model = require(__rootPath + '/config/config_db');
const db = model.db;
const refTable = model.refTable;

var viewPath = 'api/';

exports.quote = ((req, res) => {
	var type = fn.element(req.query, 'type', 'json').toLowerCase();
	if(['json', 'html', 'text'].indexOf(type) == -1){
		type = 'json';
	}

	new Promise((resolve, reject) => {	
		db.ref(fn.jup(refTable.refQuotes)).orderByKey().limitToLast(1).once('value')
		.then((snapMax) => {
			var snapVal = snapMax.val();		

			var maxNode = _.first(_.sortBy(snapVal));
			var max = maxNode.id;

			db.ref(fn.jup(refTable.refQuotes)).orderByKey().limitToFirst(1).once('value')
			.then((snapMin) => {
				var snapVal = snapMin.val();		

				var minNode = _.first(_.sortBy(snapVal));
				var min = minNode.id;	

				var randID = Math.floor((Math.random() * (max-min)) + min);
				//console.log(min, max, randID);
				var ref = db.ref(fn.jup(refTable.refQuotes)).orderByChild('id').startAt(randID);
				/*
				if(Date.now() % 2 == 0){
					ref = ref.startAt(randID);
				} else {
					ref = ref.endAt(randID);
				}
				*/
				ref.limitToFirst(1).once('value')
					.then((snapshot) =>{
						var quote =  _.first(_.sortBy(snapshot.val()));
						quote = _.extend({}, quote, { randID: randID, maxID: max, minID: min});
						resolve(quote);
					});
			});
		});
	}).then((quote) => {
		switch(type){
			case 'json':
				res.json(fn.jsonResult(true,'', quote));
				break;
			case 'html':				
				res.render(viewPath + 'quote/quote', {
					quote: quote					
				});
				break;
		}
	}).catch(err=>{
		res.json(fn.jsonResult(true,'ERROR', err));
	});

})