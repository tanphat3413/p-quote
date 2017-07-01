var constVar = require(__rootPath + '/config/const');
var fn = require(__rootPath + '/lib/function');
var _ = require('underscore');

exports.isLogged = (session)=>{
	//console.log('session:', session);
	return !_.isEmpty(session[constVar.sessLoggedInfoName]);
}
exports.getUserLoggedInfo = (session) => {
	return _.isEmpty(session[constVar.sessLoggedInfoName]) ? false : session[constVar.sessLoggedInfoName];
}
exports.setUserLoggedInfo = (session, loggedUserInfo) => {
	session[constVar.sessLoggedInfoName] = loggedUserInfo;
}
exports.clearUserLoggedInfo = (session) =>{
	if(session.hasOwnProperty(constVar.sessLoggedInfoName)){
		delete session[constVar.sessLoggedInfoName];
	}
}