var email = require('emailjs');
var q = require('q');

var server = email.server.connect({
	user: "warrenlynes@gmail.com",
	password: "XWoyPRNVVOz4MUs16EA4Aw",
	host: "smtp.mandrillapp.com",
	port: 587
})
module.exports = {
	send: function(to, from, subject, text){
		var der = q.defer();

		server.send({
			text: text,
			from: from,
			to: to,
			subject: subject

		}, function(err, message){
			console.log('email message =====> ', message);
			if(err){
				der.reject(err);
			}
			der.resolve(message);
		})

		return der.promise;
	}
}