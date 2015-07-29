var mongoose = require('mongoose');

var schoolSchema = mongoose.Schema({
	school_name: {
		type: String, 
		required: true,
		unique: true
	},

	location: {
		city: String,
		state: String
	}
	
	
})
module.exports = mongoose.model('School', schoolSchema);