var LocalStrategy = require('passport-local').Strategy;
var User = require('../App/models/User');



module.exports = function(passport){

	//passport - session - setup
	passport.serializeUser(function(user, done){
		done(null, user);
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		})
	});


	//------------------------------------------
	//			Local Login
	//				camper
	//============================================
	passport.use(new LocalStrategy({
		usernameField: 'email'
	}, function(email, password, done){

		console.log('====================================')
		console.log('local-login-camper');
		console.log('-----------email entered------', email);
		console.log('-----------password entered---', password);
		console.log('====================================')

		User.findOne({ 'login.local.email' : email }, function(err, user){
			
	//if err w/ passport
			if(err){
				console.log('passport Strategy err!!! '); 
				return done(err);
			}

 
	//if no user was found
			if(!user){
				var err = 'login failed: incorrect username or password'; // error message
				console.log('login failed : user does not exist');
				return done(err, false);
			}

			console.log('user found: ', user);

			user.validPassword(password, function(res){

	//if user name good but password invalid
				if(!res){
					var err = 'login failed: incorrect username or password'; // error message
					console.log('login failed: incorrect password');
					return done(err, false);
				}

	//if username & password  ==== valid 
				console.log('username && password === valid');
				done(null, user);
			});
		});
	}));
}