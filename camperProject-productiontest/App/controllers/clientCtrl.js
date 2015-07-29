
var mongoose = require('mongoose');
var Client = mongoose.model('Client');

module.exports = {

	create: function(req,res){
		var client = new Client(req.body);
		client.save(function(err, saved){
			if(err){
				console.log('client NOT saved: ', err);
			}
			res.send(saved);
		})
	},

	readAll: function(req,res){
		Client.find().exec().then(function(found){
			if(!found){
				res.status(404).end();
			}
			res.send(found);
		})
	},

	readMe: function(req,res){
		res.send(req.user);
	},

	
}