var winston = require ('winston');
var path = require('path');
var fs = require('fs');

var logDirectory = __rootPath + '/logs';
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
var d = new Date();
var datestring =  d.getFullYear() + "_" + ("0"+(d.getMonth()+1)).slice(-2) + "_"  + ("0" + d.getDate()).slice(-2);

var logger = new (winston.Logger)({
    transports: [
      //new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: logDirectory +'/'+ datestring + '.log' })
    ]
});

module.exports = logger;