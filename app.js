var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Instalación de los MW
app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//Helpers dinámicos:
app.use(function(req, res, next) {
  //guardar path en sessión.redir para después de login
  if(!req.path.match(/\/login|\/logout/)){
    req.session.redir = req.path;
  }
  //Hacer visible req.session en las vistas
  //app.locals y res.locals para definir variables locales en MWs.
  //app.locals es visible en todo app y res.locals solo es visible en res en el mismo middleware
  res.locals.session = req.session;
  //Para el head de statdísticas
  res.locals.isStatistics=false;
  next();
});

//Autologout (módulo 9)
app.use(function(req, res, next){
    var timeout = 15 * 1000; //Dos minutos (120 segundos)
    if(req.session.user){
        // Petición autenticada
        var now = new Date().getTime();
        var lastVisit = req.session.user.lastVisit || now;

        if (now - lastVisit > timeout){
            // Sesión caducada
            delete req.session.user;
            //var err = new Error('La sesión ha caducado');
            //err.status = 419;
            //next(err);
        }else{
            req.session.user.lastVisit = now;
        }
    }
    next();
});

app.use('/', routes);


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
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err,
        errors: []
    });
});


module.exports = app;
