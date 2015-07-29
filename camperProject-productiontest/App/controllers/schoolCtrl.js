var mongoose = require('mongoose');
var School = require('../models/School');

module.exports = {

	create: function(req,res){
		var scho = new School(req.body);
		scho.save(function(err, saved){
			if(err)res.status(500).end();
			res.send(saved);
		})
	},

	read: function(req,res){
		School.find().exec().then(function(found){
			if(!found){
				res.status(404).end();
			}
			res.send(found);
		})
	},

	readOne: function(req,res){
		School.findOne({_id: req.query.id}).exec().then(function(found){
			if(!found){
				res.satus(404).end();
			}
			res.send(found);
		})
	},

	update: function(req,res){
		School.findByIdAndUpdate(req.params.schoolId, req.body, function(err, updated){
			if(err)res.status(500).send(err);
			res.send(updated);
		})
	}


}