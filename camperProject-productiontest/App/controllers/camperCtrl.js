var mongoose = require('mongoose');
var Camper = mongoose.model('Camper');
// var Camper = require('../models/Camper'); 

module.exports = {

	create: function(req, res){
		var camper = new Camper(req.body);
		
		camper.save(function(err, saved){
			if(err)res.status(500).send(err);
			res.send(saved);
		})
	},

	readAll: function(req,res){
		Camper.find().exec().then(function(found){
			if(!found) res.status(404).send(err);
			res.send(found);
		})
	},

	readOne: function(req,res){
		Camper.findOne({_id: req.params.camperId}).exec().then(function(found){
			
			console.log("reading camper: ", req.params.camperId);

			if(!found)res.status(404).send(err);
			res.send(found);
		})
	},

	update: function(req, res){
		Camper.findByIdAndUpdate(req.params.id, req.body, function(err, updated){
			if(err)res.status(500).send(err);
			res.send(updated);
		})
	},

	delete: function(req,res){
		Camper.findByIdAndRemove(req.params.camperId, function(err, gone){
			if(err)res.status(500).send(err);
			res.send(gone);
		})
	}
}