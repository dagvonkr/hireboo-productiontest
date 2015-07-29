var mongoose = require('mongoose');

var projectSchema = mongoose.Schema({

	description: {

		title: {
			type: String,
			required: true
		},

		client_website: {
			type: String 
		},

		description: {
			type: String
		},

		examples: Array,

		design_provided: {
			type: Boolean
		},

		platform: {
			type: String,
			enum: [
				'Web-Development',
				'iOs', 
				'Android'
			]
		}
	},

	date_range: {
		date_posted: {
			type: Date,
			default: Date.now()
		},

		date_project_started: {
			type: Date,
			default: null
		},

		date_finished: {
			type: Date, 
			default : null
		}
	},

	client_poster: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},

	assigned_to: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},

	status: {
		available: {
			type:Boolean,
			default: true
		},
		assigned:  {
			type:Boolean,
			default: false
		},
		paid:  {
			type:Boolean,
			default: false
		},
		finished:  {
			type:Boolean,
			default: false
		}



		/*type: String, 
		enum:[
				"available",
				"assigned", // Take project out of listings. 
				"finished",
				"project-paid" // Take project out of listings. 
		]*/
	},

	chat: {
		type: String	
	} 


});

/*projectSchema.pre('save',function(next){
	var project = this;

	if(!req.user){
		console.log('no user?');
		return next();
	}
	project.client_poster = req.user;
	next();
})*/

module.exports = mongoose.model('Project', projectSchema);