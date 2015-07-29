var mongoose = require('mongoose');
var User = mongoose.model('User');

var EmailServ = require('../../EmailServer');

var fs = require("fs")

var aws = require('aws-sdk');
aws.config.update({
	accessKeyId: "AKIAIHHH24JLSXNHKSKA",/*process.env.AWS_ACCESS_KEY_ID,// "AKIAIHHH24JLSXNHKSKA"*/
	secretAccessKey:"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" /*process.env.AWS_SECRET_ACCESS_KEY //"tZ4QMjI7zEzR9CCPPf/GHVdqk43cdycCjy/tdHRV"*/
})


module.exports = {

	create: function(req, res){
		console.log(req.body.login.local);

		User.findOne({"login.local.email": req.body.login.local.email}, function(err, found){
			console.log(found);

			//if user already exists
			if(found){
				return res.status(500).json({message: "user with that email already exists ", err: "email"});
			}

			//if password too short
			if(req.body.login.local.password.length <= 5){
				 
			}
			
			//create and save user
			var user = new User(req.body);
			user.save(function(err, saved){
				if(err){
					console.log("User not created");
					return res.status(500).json({message: "err creating user, please try again", err: 20});
				}
				//send email
				EmailServ.send(saved.name + " <" + saved.login.local.email + ">", "Warren Lynes <warrenlynes@gmail.com>",  "Thank you for signing up!", "thank you for signing up!");
				EmailServ.send("Warren Lynes <warrenlynes@gmail.com>", "Warren Lynes <warrenlynes@gmail.com>", "new user Registered", "A New user has registered for your site.\n\n" + 
					"name: \n" + saved.name + "\n" + 
					"email: \n" + saved.login.local.email);					

				console.log('User created!');
				res.send(saved);					
			})
		})
			
	},

	readAll: function(req,res){
		User.find().exec().then(function(found){
			if(!found) res.status(404).end();
			res.send(found);
		})
	},

	
	readMe: function(req,res){
		if(req.user){
			User.findOne({_id:req.user._id})
				.populate("projects completed_projects school")
				.exec(function(err, docs) {
					var options = {
						path: 'camper_info.school',
						model: 'School'
					};
					if(err){
						res.status(400).send(err);
					}
					User.populate(docs, options, function(err, docs){
						console.log(docs);
						if(err)res.status(400).send(err);
						res.send(docs);
					})
				})
		}else{
			res.status(404).end();
		}
	},
	
	readOne:function(req,res){
		User.findOne({_id: req.query.id}).exec().then(function(found){
			if(!found){
				res.status(404).end();

			}
			res.send(found);
		})
	},

	update: function(req,res){
		User.findByIdAndUpdate(req.params.userId, req.body, function(err, result){
			if(err){
				console.log(result);
				res.status(500).end();
			}
			console.log(result);
			res.send(result);
		})
	},

	delete: function(req,res){
		User.findByIdAndRemove(req.params.userId, function(err,res){
			if(err){
				res.status(500).end();
			}
			res.send(res);
		})
	},

	picture: function(req,res){
		console.log(req.files);

		var file = req.files.profile_picture;

		var s3_filename = req.user._id+'.'+file.extension;
		var s3_bucket_name = 'bootcampers';
		var s3bucket = new aws.S3({params: {Bucket: s3_bucket_name}});
		

		fs.readFile(file.path, function(err, file_buffer){

			var params = {
				Key: s3_filename,
				Body: file_buffer,
				ACL: 'public-read',
				ContentType: file.mimeType
			};

			
			s3bucket.putObject(params, function(s3_err, response){
				console.log(response);
				if(s3_err){
					console.log('s3_err',s3_err);
					res.status(500).send(s3_err);
				}
				User.findOne({_id: req.user._id}, function(err, found){
					console.log('user found for profile pic change ========>', found);
					if(err){
						res.status(404).end();
					}
					found.user_profile.profile_picture ="https://s3.amazonaws.com/"+ s3_bucket_name + '/' + s3_filename;
					found.save(function(err, saved){
						if(err){
							res.status(500).json({message: "user profile picture not saved!!!!"})
						}
						console.log("user profile_picture saved");
						res.send(saved);
					})
					
				})
				
			})
		});

//alternative way to store in S3
		/*s3bucket.createBucket(function(){
				s3bucket.upload(params, function(err,data){
					if(err){
						console.log(err);
						res.send(err);
					}
					console.log(data);
					res.send(data);
				})
			})*/


		/*var file = req.files.profile_picture;
		var public_path = '/img/profiles/' + req.user._id + '.' + file.extension;

		console.log(file);

		fs.rename(file.path, './public' + public_path, function(){
			User.findOneAndUpdate({_id: req.user._id}, 
				{profile_picture: public_path}, function(){
					return res.status(200).end();
				})
		})*/
	}

	
}