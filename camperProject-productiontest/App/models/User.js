var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var q = require('q');

var userSchema = mongoose.Schema({


	login: {
		local: {
			email: {
				type: String,
				unique: true,
				required: true
			},
			password: {
				type: String, 
				required: true
			}
		}
	},

	user_type: {
		camper: Boolean,
		client: Boolean
	},

	user_profile:{
		name: String,
		email: String,
		phone: String,
		location: String,

		company_name: String,

		profile_picture: {
			type: String,
			default: "http://i.space.com/images/i/000/019/699/i02/milky-way-mount-shasta.jpg?1342794653"
		}
	},

	
	camper_info: {

		area: {
			type: String,
			enum: [
				'web-development',
				'ios', 
				'android'
			]
		},

		languages: Array,

		school: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'School'
		}]
	},

	projects: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Project'
	}],
	
	completed_projects: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Project'
	}]

});


userSchema.pre('save', function(next){
	var user = this;
	console.log('hashing ========> ', user);
	 
	
	if(!user.isModified('login')){
		return next()
	}

	console.log('generating salt');

	bcrypt.genSalt(8, function(err, salt){
		if(err){
			return next(err);
		}
		else{
			console.log('hashing password')

			bcrypt.hash(user.login.local.password, salt, function(err){
				if(err){
					console.log('hash - progress - error');
					next(err);
				}
			}, function(err, hash){
				if(err){
					console.log('password - not hashed');
					return next(err);
				}
				else{
					console.log('password - hashed');
					user.login.local.password = hash;
					next()
				}
			});
		}
	})

});

userSchema.methods.validPassword = function(password, cb){
	var user = this;

	bcrypt.compare(password, user.login.local.password, function(err, isMatch){
		console.log('---isMatch ==== ', isMatch);
		if(err) return cb(err);
		cb(isMatch);
	})
}

module.exports = mongoose.model('User', userSchema);