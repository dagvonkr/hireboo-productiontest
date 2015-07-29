var mongoose = require("mongoose");
var Project = require('../models/Project');
var Client = require('../models/User');
var User = require('../models/User');


module.exports = {

	create: function(req, res){
		console.log(req.body);
		var client = req.user

		var proj = new Project(req.body);
		
		proj.save(function(err, saved){
			console.log('Error in proeject Ctrl -->', err);
			if(err)res.status(500).end();
			
			Client.findByIdAndUpdate(client, 
				{$push:{projects:saved}},
				{safe:true, upsert: true, new:true},
				function(err, client) {
					if (err) res.status(500).end()
						res.send(saved)
				}  
				)	
		})
	},

	read: function(req,res){
		Project.find().exec().then(function(found){
			if(!found){
				res.status(404).end();

			}
			res.send(found);
		})
	},

	readOne:function(req,res){
		Project.findOne({_id: req.query.id}).exec().then(function(found){
			if(!found){
				res.status(404).end();
			}
			res.send(found);
 
		})
	},

	readAvailable: function(req,res){
		var query = Project.find({});
		query.where('assigned_to', null)
			.skip(req.params.skip).limit(5)
		query.exec(function(err, found){
			if(err)res.status(404).end();
			res.send(found);
		})
	},

	update: function(req, res){
		Project.findByIdAndUpdate(req.params.projectId, req.body, function(err, result){
			if(err){
				res.status(500).end();
			}
			res.send(result);
		})
	},

	delete: function(req,res){
		var proj = req.params.projectId;
		console.log('project =======>', proj);
		User.findOne({_id: req.user._id}).exec().then(function(found){
			if(!found){
				console.log('user not found !!');
				return res.status(404).json({message: "no user found"});
			}else{

				console.log(found.projects);

				found.projects.splice(found.projects.indexOf(proj), 1);
				found.save(function(err,saved){
					if(err){
						res.Status(400).end();
					}
					else{
						Project.findByIdAndRemove(proj, function(err,result){
							if(err){
								res.status(500).end();
							}
							res.send(saved);
						})
					}
				})
				

				
			}
		})
		
	},

	book: function(req, res){

		console.log('req.user: ', req.user);
		User.findOne({_id: req.user._id}).exec().then(function(found){
			if(!found){
				return res.status(404).json({message: "user not found"})
			}else if(found.projects.length > 0){
				return res.status(400).json({message: "finish the project you have started then come back for more"})
			}else{
				Project.findOne({_id: req.query.id}).exec().then(function(found){
					if(!found){
						console.log("Project not Found!!!");
						return res.status(404).json({message: "error finding project"})
					}else{

						found.assigned_to = req.user._id;
						found.status.available = false;
						found.status.assigned = true;

						found.save(function(err, saved){
							if(err){
								console.log("project not updated", err);
								return res.status(400).json({message: "error updating project"})
							}else{
							User.findByIdAndUpdate(req.user._id, 
								{$push: {projects: saved }},
								{safe:true, upsert:true, new:true},
								function(err, User){
									if(err){
										return res.status(500).send(err);
									}
									return res.send(saved);
								})
							}
						})
					}
				})
			}
		})

	},

	unbook: function(req,res){


		Project.findOne({_id: req.query.id}).exec().then(function(found){
			
			
			if(!found){
				console.log('not found');
				res.status(404).json({message: "no project found"})

			}else if(found.assigned_to){
				console.log(" found!! assigned_to======> ", found.assigned_to);

				var assigned_to = found.assigned_to;
				found.assigned_to = null;
				found.status.available = true;
				found.status.assigned = false;

				console.log(" deleted project assigned_to======> ", found);


				found.save(function(err, saved){
					if(err){
						console.log('project not saved!!=====>', saved);
						return res.status(400).json({message: "project not saved", error: err})
					}
					else{
						console.log('project updated and saved =======>', saved);
						console.log('searching for User=======>', assigned_to);
						User.findOne({_id: assigned_to}, function(err, user){
							if(err){
								res.status(400).json({message: "user not made available", error: err})
							}else{
								user.projects.splice(0,1);
								user.save(function(err,user_saved){
									if(err){
										res.status(400).json({message: "user not made available (save)", error: err })
									}
									console.log(user_saved);
									res.send(user_saved);
								})
							}
						})
					}
				})

			}

		})
	},

	finish: function(req,res){
		Project.findOne({_id: req.query.id}).exec().then(function(found){
			if(!found){
				console.log('project not found!!!!');
				return res.status(404).end();
			}else{
				var proj = found;

				proj.status.finished = true;
				proj.save(function(err,saved){
					console.log(err, saved);
				})

				console.log('project found=============>', proj);
				console.log('project assigned_to=============', proj.assigned_to);

				User.findByIdAndUpdate(proj.assigned_to, 
					{$push: {completed_projects: proj}},
					{safe:true, upsert:true, new:true},
					function(err, saved){
						if(err){
							console.log("user not updated")
							return res.status(400).json({message: "user not updated"})
						}else{
							User.findOne({_id: proj.assigned_to}).exec().then(function(found){
								if(err){
									return res.status(400).end();
								}else{
									found.projects.splice(0,1);
									found.save(function(err, saved){
										if(err){
											return res.status(500).send(err);
										}else{
											res.send(saved);
										}
									})
								}
							})
						}
					})
			}
		})
		/*Project.findOne({_id: req.query.id}).exec().then(function(found){
			if(!found){
				console.log("project not found!!!!");
				return res.status(404).json({message: "no project found"})
			}else{

				var project = found;
				var camper = found.assigned_to;

				console.log("project found =============>", found);

				console.log("looking for ============>", found.assigned_to);
				
				User.findOne({_id: camper}).exec().then(function(found){
					if(!found){
						res.status(404).end;
					}else{
						{$push: {completed_projects: project}}
						{$set: {projects: []}}
						found.save(function(err, saved){
							if(err){
								res.status(400).end();
							}
							res.send(saved);
						})
					}
				})
				
			}
		})*/
	},
	paid: function(req,res){
			Project.findOne({_id: req.params.projectId}).exec().then(function(found){
				if(!found){
					console.log('project not found');
					return res.status(404).json({message: "no user found"})
				}else{
					found.status.paid = true;
					found.save(function(err, saved){
						if(err){
							res.status(400).send(err);
						}else{
							res.send(saved);
						}
					})
				}
			})
		}
}