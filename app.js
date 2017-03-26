// dependencies
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var session = require('express-session');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(function(req, res, next){

    console.log("I listened on port: " + app.get('port') + "\n");
    next();
});

// pass the express object so it can inherit from MemoryStore
var MemcachedStore = require('connect-memcached')(session);
var mcds = new MemcachedStore({ hosts: "localhost:11211" });

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: mcds,
    cookie: { path: '/', httpOnly: true, secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 },// Week long cookie
}));

app.use(passport.initialize());
app.use(flash());
app.use(passport.session());



app.use('/', routes);

app.get('/test_roundrobin', function (req, res) {
    var x = req.session.last_access;
    req.session.last_access = new Date();

    res.end("auth user: 30 secs expire: \n" + req.user.account + "  port: " + app.get('port') + "\n You2 last asked for this page at: " + x);

});

// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// mongoose
mongoose.connect('mongodb://admin:admin123@local.bonray.com.tw:27017/admin');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
