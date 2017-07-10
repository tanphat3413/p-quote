const _ = require('underscore');
const s = require('string');
const path = require('path');
var os = require('os');

const constVar = require(__rootPath + '/config/const');
const fn = require(__rootPath + '/lib/function');
const authHelper = require(__rootPath + '/lib/auth_helper');
const logger = require(__rootPath + '/lib/logger');

const model = require(__rootPath + '/config/config_db');
const db = model.db;
const refTable = model.refTable;

const viewPath = 'backend/login/';

exports.login = (req, res) => {

	var data = _.extend(req._layoutData,  {
		title: 'Login'
	});

	res.render(viewPath + 'login', data);
}

exports.postLogin = (req, res) => {

	req.check('email', 'Vui lòng nhập email đăng nhập').notEmpty();
	req.check('password', 'Bạn chưa nhập Password').notEmpty();

	var errors = req.validationErrors();
	if (errors) {
		res.json(fn.jsonResult(false, 'Validate Fail', errors));
		return;

	} else {

		var loginEmail = fn.element(req.body, 'email', ''),
		password = fn.element(req.body, 'password', '');

		var userRef = db.ref(refTable.refUsers);
		userRef.orderByChild('email').equalTo(loginEmail).once('value')
			.then((snapUserExists) => {
				var userData = snapUserExists.val();
				if (!userData) {
					res.json(fn.jsonResult(false, 'Username invalid', [{ field: 'email', error: 'Email chưa đăng ký tài khoản ' }]));
					return;
				}
				userData = _.first(_.sortBy(userData));
				fn.verifyHashString(password, fn.element(userData, 'password', ''))
					.then((ok) => {
						if (ok) {
							authHelper.setUserLoggedInfo(req.session, {
								fullname: userData.fullname
							});

							res.json(fn.jsonResult(true));

						} else {
							res.json(fn.jsonResult(false, 'Password invalid', [{ field: 'password', error: 'Mật khẩu đăng nhập không đúng' }]));
							return;
						}
					});
			})
			.catch((err) =>{
				logger.error(err);
				console.log(err);
				res.json(fn.jsonResult(false, 'SYS_ERROR', err));
			});
	}
}

exports.createLogin = (req, res) => {

	var loginEmail = fn.element(req.body, 'email', ''),
		password = fn.element(req.body, 'password', '');

	req.check('email', 'Bạn chưa nhập email đăng nhập').notEmpty();
	req.check('password', 'Password không được trống').notEmpty();

	var errors = req.validationErrors();
	if (errors) {
		res.json(fn.jsonResult(false, 'Validate Fail', errors));
		return;

	} else {

		fn.hashString(password)
		.then((hashPass) => {
			var userRef = db.ref(refTable.refUsers);
			userRef.push().set({
				email: loginEmail,
				password: hashPass,
				fullname: 'Administrator'
			});
			res.json(fn.jsonResult(true, 'OK'));
		})
		.catch((err) => {
			console.log(err);
			res.json(fn.jsonResult(false, 'ERROR', err));
		});			
	}
}