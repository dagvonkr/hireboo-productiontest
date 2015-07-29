var mongoose = require('mongoose');
var User = mongoose.model('User');

var EmailServer = require('../../EmailServer');

module.exports = {

	create: function(req,res){
		console.log('looking for -----------> ', req.body.email);
		User.findOne({"login.local.email": req.body.email}, function(err, found){
			
			console.log('found--------------->', found);

			if(!found){
				res.status(404).json({message: "user not found"});
				
			}else{
				
				EmailServer.send("name <" + found.login.local.email + ">", "Warren Lynes <warrenlynes@gmail.com>",  "varification email", "below is your varification code: \n\n" +
					"code: daggystyle");
				res.status(200).json({message: "daggystyle", user: found});
			}
		})
	},

	check: function(req, res){
		if(req.body.entered === req.body.given){
			console.log('check============> success');
			res.status(200).json({message: "success"})
		}else{
			console.log('check============> failure');
			res.status(500).json({message: "codes didnt match" })
		}
	}
}