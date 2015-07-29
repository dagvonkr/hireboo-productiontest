
//model controllers
var userCtrl = require('../App/controllers/userCtrl');
var projectCtrl = require('../App/controllers/projectCtrl');
var schoolCtrl = require('../App/controllers/schoolCtrl');
var passwordCtrl = require('../App/controllers/passwordCtrl');



module.exports = function(app, passport){


//===========================================================
//		require Auth function		=========================
//-----------------------------------------------------------
	
	var requireAuth = function(req,res,next){
		if(!req.isAuthenticated()){
			return res.status(401).end();
		}
		console.log(req.user);
		next();
	}
	//camper
	var requireAuthCamper = function(req , res , next) {
		if(req.user){
			console.log("authorizing-camper: ", req.user);	
			if(req.user.user_type.camper && req.isAuthenticated){
				return next();
			}
		}
		return res.status(401).end();
	}

	//client
	var requireAuthClient = function(req,res,next){
		console.log('authorizing-client: ', req.user);
		if(req.user){
			if(req.user.user_type.client && req.isAuthenticated()){
				return next();
			}
		}
		return res.status(401).end();

	}
	

	//password - reset
	app.post('/passwordRecover', passwordCtrl.create);
	app.post('/passwordCheck', passwordCtrl.check);



//------------------------------------------------------------
//===========================================
//		user login / logout
//-------------------------------------------
	app.post('/user/login', passport.authenticate('local', { failureRedirect: '/#/' }), function(req, res){
		return res.send(req.user);
	})
	

//	logout	

	app.get('/user/logout', function(req, res){
		req.logout();
		res.redirect('/')
	})

//-------------------------------------------




	//===========================================
	//			USERS
	//-------------------------------------------
	app.post('/user', userCtrl.create);
	app.get('/user', userCtrl.readAll);
	app.get('/user/read', userCtrl.readOne);
	app.put('/user/:userId', userCtrl.update);
	app.delete('/user/:userId', userCtrl.delete);


	var User = require("./models/User");
	

	app.post('/user/me/profile_picture', requireAuth, userCtrl.picture)

//--------------------------------------------



	//============================================
	//		camper
	//--------------------------------------------
	app.get('/camper/me', requireAuthCamper, userCtrl.readMe);




	//============================================
	//		clent
	//--------------------------------------------
	app.get('/client/me', requireAuthClient, userCtrl.readMe);


	app.get('/me', userCtrl.readMe); 




	//============================================
	//		Project
	//--------------------------------------------
	app.post('/api/project', requireAuthClient, projectCtrl.create);
	app.get('/api/project', projectCtrl.read);
	app.get('/api/project/read', projectCtrl.readOne);
	app.get('/api/project/available/:skip', projectCtrl.readAvailable);
	app.put('/api/project/update/:projectId', projectCtrl.update);
	app.put('/api/project/book', requireAuthCamper, projectCtrl.book);
	app.put('/api/project/unbook', requireAuth, projectCtrl.unbook);
	app.put('/api/project/finish', requireAuth, projectCtrl.finish);
	app.put('/api/project/paid/:projectId', requireAuthClient, projectCtrl.paid);
	app.delete('/api/project/delete/:projectId', requireAuthClient, projectCtrl.delete);



	//============================================
	//		School
	//--------------------------------------------
	app.post('/api/school', schoolCtrl.create);
	app.get('/api/school/', schoolCtrl.read);
	app.get('/api/school/read', schoolCtrl.readOne);
	app.put('/api/school/:schoolId', schoolCtrl.update);



}