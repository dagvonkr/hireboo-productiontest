var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var session = require('express-session');
var passport = require('passport');
var morgan = require('morgan');

var cors = require('cors');
var multer = require('multer');
var fs = require('fs');



var app = express();

// changed to port 80 for hosting
var port = 80;


//passport config
require('./config/passport.js')(passport);

//----------------------------------
//		configure mongo / mongoose
//----------------------------------
var configuredb = require('./config/database.js');

mongoose.connect(configuredb.url, function(err){
	if(err){
		console.log('goose missing!!!');
	}
	else{
		console.log('goose = ready ');
	}
})
	

// ===================================
//		express - middleWare
//------------------------------------

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());
app.use(express.static(__dirname + '/public'));
app.use(multer({
	dest: './tmp/',
	onFileUpLoadStart : function(file){
		console.log('starting ', file.name);
	} ,
	onFileUploadData : function(file, data){
		console.log('recieving data')
	},
	onFileUploadComplete: function(file){
		console.log('Completed File');
	},
	onParseStart: function(){
		console.log('starting parse req.');
	},
	onPaseEnd: function(req, next){
		console.log('done parsing');
		next();
	},
	onError: function(e, next){
		if(e){
			console.log(e.stack);
		}
	}
}));
// app.use(cookie());


//passport - middleware
app.use(session( { secret: 'DAGGYstyle' }));
app.use(passport.initialize());
app.use(passport.session());






//====================================
//		api routes
//-----------------------------------
require('./App/routes.js')(app, passport);



app.listen(port, function(){
	console.log('app = ready', port);
})

