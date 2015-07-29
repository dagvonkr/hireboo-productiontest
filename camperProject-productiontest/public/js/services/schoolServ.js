angular.module('BootCamper').service('schoolServ', function($http, $q){

	this.read_schools = function(){
		var der = $q.defer();

		$http({
			method: "GET",
			url: "/api/school"
		}).then(function(res){
			der.resolve(res.data);
		}).catch(function(err){
			der.reject(err.data);
		})

		return der.promise;
	}
})