/**
 * Created by PhatHT on 27/12/2016.
 */

var firebase = require("firebase");
var logger = require(__rootPath + '/lib/logger');

firebase.initializeApp({
	apiKey: "AIzaSyAUFJFwUmAuIfBFaFpRQ2Z_bPly3Y55Z7c",
	authDomain: "tprd-dbcff.firebaseapp.com",
	databaseURL: "https://tprd-dbcff.firebaseio.com",
	projectId: "tprd-dbcff",
	storageBucket: "tprd-dbcff.appspot.com",
	messagingSenderId: "1028481606740"
});
var fbAuthUser = 'user_default@tprd-app.com';
var fbAuthKey = '123456+++';

exports.firebase = firebase;
exports.db = firebase.database();
firebase.auth().signInWithEmailAndPassword(fbAuthUser, fbAuthKey)
	.then((rs) =>{
		logger.info('DB LOGIN SUCCESS');
	}).catch((err) => {
		console.log(err);
		logger.error('DB LOGIN FAIL');
	});

exports.auth = firebase.auth();

exports.refTable = {
	refQuotes: 'quotes',
	refQuoteIDs: 'quote_ids',
	refUsers: 'users'
};