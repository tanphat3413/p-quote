const _ = require('underscore');
const s = require('string');
const path = require('path');

const constVar = require(__rootPath + '/config/const');
const fn = require(__rootPath + '/lib/function');
const authHelper = require(__rootPath + '/lib/auth_helper');
const goodreadsClawer = require(__rootPath+'/lib/claw_goodreads_quote');

const model = require(__rootPath + '/config/config_db');
const db = model.db;
const refTable = model.refTable;

var _listSource = [
		{id: 'goodreads.com', name: 'goodreads.com',  link : 'https://www.goodreads.com/quotes'}
	];
function get_link_claw(id){
	var item = _.findWhere(_listSource, {id: id});
	return fn.element(item, 'link', false);
}

const viewPath = 'backend/quote/';
exports.list = (req, res) =>{

	if (!authHelper.isLogged(req.session)) {
		res.redirect('/login');
		return;
	}

	var data = _.extend(req._layoutData, {
		pageTitle: 'Quote List',
		totalQuotes: 100				
	});	
	res.render(viewPath + 'list', data);

}
exports.list_comp = (req, res) =>{

	if (!authHelper.isLogged(req.session)) {
		res.redirect('/login');
		return;
	}
	var data = _.extend({}, req._layoutData, {list: []});

	//get list
	new Promise((resolve, reject) => {
		db.ref(refTable.refQuotes).orderByChild('dateCreate').limitToLast(50)
			.once('value').then((fbRs) =>{
				if(fbRs){
					resolve(_.sortBy(fbRs.val(), 'dateCreate'));
				} else {
					resolve([]);
				}
			}); 
	}).then((rs) =>{
		data.list = rs;
		res.render(viewPath + 'list_comp', data);

	}).catch((err)=>{
		logger.error(err);		
		res.render(viewPath + 'list_comp', data);
	});	
}

exports.get_quote = (req, res) => {
	var id = fn.element(req.query, 'id', '');

	new Promise((resolve, reject) => {
		if(id){
			db.ref(fn.jup(refTable.refQuotes, id)).once('value')
			.then((snapshot) =>{
				var quote = snapshot.val() ?  snapshot.val() : {};	
				resolve(quote);
			});
		} else {
			resolve({});
		}
	})
	.then((quote) => {
		res.json(fn.jsonResult(true,'', quote));
	})
	.catch((err) => {
		res.json(fn.jsonResult(false, '', err));
	});	
}

exports.form = (req, res) => {

	if (!authHelper.isLogged(req.session)) {
		res.json(fn.jsonResult(false, 'Login time out'));		
	}

	var quote = fn.element(req.body, 'quote', ''),
			author = fn.element(req.body, 'author', ''),
			action = fn.element(req.body, 'action', 'insert'),
			id =  fn.element(req.body, 'id', '');
		
	if(action == 'delete'){
		if(id){
			db.ref(fn.jup(refTable.refQuotes, id)).remove();
			res.json(fn.jsonResult(true, 'OK'));
		} else {
			res.json(fn.jsonResult(false, 'Missing Delete ID'));
		}		
		return;
	}

	req.check('quote', 'Nội dung không được để trống').notEmpty();

	var errors = req.validationErrors();
	if (errors) {
		res.json(fn.jsonResult(false, 'Validate Fail', errors));
		return;

	} else {

		if(action == 'insert'){
			id = fn.GetTimestamp();
		}

		db.ref(fn.jup(refTable.refQuotes, id)).set({			
			id: parseInt(id),
			quote: quote,
			author: author,
			dateCreate: parseInt(id)
		});

		res.json(fn.jsonResult(true, 'OK'));
	}
}

exports.claw_list = (req, res) =>{

	if (!authHelper.isLogged(req.session)) {
		res.redirect('/login');
		return;
	}

	var source = fn.element(req.body, 'source', '');
	var link = get_link_claw(source);
	var quoteList = [];

	new Promise((resolve, reject) => {

		if(source && link){
			switch (source) {
				case 'goodreads.com': 
					goodreadsClawer.get_claw(link).then(quoteList => {
						resolve(quoteList);
						return;
					});				
				break;
			}
			
		} else {
			resolve([]);
		}

	}).then((quoteList) => {

		var data = _.extend(req._layoutData, {
										quoteList: quoteList,
										listSource: _listSource,
										pageTitle: 'Get Quote List',
									});	

		res.render(viewPath + 'claw_list', data);

	}).catch((error)=>{

		var data = _.extend(req._layoutData, {
										quoteList: [],
										listSource: _listSource,
										pageTitle: 'Get Quote List',
									});	
		res.render(viewPath + 'claw_list', data);
	});
}
