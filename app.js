var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var moment = require('moment');

var ejsLayout = require('ejs-layout');
var session = require('express-session');
var os = require('os');
var fs = require('fs');
var morgan = require('morgan');
var expressValidator = require('express-validator');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', ejsLayout.__express);


// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(expressValidator([
	
]));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var logDirectory = path.join(__dirname, 'logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
var d = new Date();
var datestring =  d.getFullYear() + "_" + ("0"+(d.getMonth()+1)).slice(-2) + "_"  + ("0" + d.getDate()).slice(-2);

var accessLogStream = fs.createWriteStream(path.join(logDirectory, datestring +'.log'), {flags: 'a'});
//app.use(morgan('combined', {stream: accessLogStream}));

//Session
app.use(session({    
    secret: '#tpr&d@2017#',
	name: 'setpr@d',
	resave: true,
	saveUninitialized: true
}));

//Global Variable
global.__rootPath = path.resolve(__dirname);
global.__hostName = os.hostname();

//Set default Layout variable
app.use(function(req,res,next){

	req._layoutData = {
		moment: moment,
		baseURL : req.headers.host,
		pageTitle: 'TPR&D',
		loggedUser: {}
	};
	next();
});

//BEGIN CODE EDIT
//Load & Set Routes
var testRouter = require(__rootPath + '/routes/test_router');
var loginRouter = require(__rootPath + '/routes/login_router');
var apiRouter = require(__rootPath + '/routes/api_router');

app.use('/', loginRouter);
app.use('/test', testRouter);
app.use('/login', loginRouter);

var quoteRouter = require(__rootPath + '/routes/quote_router');
app.use('/quote', quoteRouter);

app.use('/api', apiRouter);

///END EDIT

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
