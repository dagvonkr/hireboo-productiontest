angular.module('BootCamper').service('passwordServ', function($http, $q){

	this.send_reset_email = function(email){

		var der = $q.defer();

		$http({
			method: 'POST',
			url: '/passwordRecover',
			data: email
		}).then(function(res){
			console.log('send_reset_email==========>', res.data);
			if(res.status != 200){
				der.reject(res.data);
			}else{
				der.resolve(res.data);
			}
		})

		return der.promise;
	}

	this.varify = function(codes){
		var der = $q.defer();

		$http({
			method: 'POST',
			url: '/passwordCheck',
			data: codes
		}).then(function(res){
			if(res.status != 200){
				console.log('varify==========>', res.data);
				der.reject(res.data);
			}else{
				console.log('varify==========>', res.data);
				der.resolve(res.data);
			}
		})

		return der.promise;
	}
})