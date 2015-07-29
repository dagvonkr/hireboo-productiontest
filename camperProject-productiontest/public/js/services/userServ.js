angular.module('BootCamper').service('userServ', function($http, $q, $rootScope){

	var userServ = this;

	var register_url= '/user';
	var login_url= '/user/login';


	this.register = function(user) {

		console.log(user);

		var defer = $q.defer();

		$http({ 

			method: 'POST', 
			url: register_url,
			data: user

		}).then(function(res) {
			userServ.read_user();
			defer.resolve(res);
		}, function(err) {
			defer.reject(err);
		})

		
		return defer.promise;

	}

	
	this.login = function(user) {

		console.log(user);

		var defer = $q.defer();

		$http({

			method: 'POST', 
			url: login_url, 
			data: user

		})
		.then(function(res) {
			userServ.read_user();
			defer.resolve(res);
		},function(err){
			defer.reject(err);
		})

		return defer.promise;
	},

	this.read_user = function(){
		var defer = $q.defer();
		$http({
			method:"GET",
			url: "/me"
		}).then(function(res){
			userServ.user = res.data;
			defer.resolve(res.data);
			$rootScope.$broadcast('user_changed');
		}, function(err){
			defer.reject(err.data);
		})

		 return defer.promise;
	}

	this.update_user = function(updateUser, unique_id){
		console.log('Updating user-->', updateUser, 'unique_id-->', unique_id);
		var defer = $q.defer();
		$http({
			method: 'PUT',
			url: '/user/' + unique_id,
			data: updateUser
		}).then(function(updateUser) {

			console.log('Heres the data-->', updateUser);	
			defer.resolve(updateUser)
		}, function(err){
			defer.reject(err);
		})

		return defer.promise;
	}


	this.read_camper = function(){

		console.log('read_camper');
		var defer = $q.defer();
		$http({
			method: 'GET',
			url:  '/camper/me'
		}).then(function(res){
			defer.resolve(res.data);
		}).catch(function(err){
			defer.reject(err.data);
		})

		return defer.promise;
	}

	this.read_client = function(){

		console.log('read_client');
		var defer = $q.defer();
		$http({
			method: 'GET',
			url:  '/client/me'
		}).then(function(res){
			defer.resolve(res.data);
		}).catch(function(err){
			defer.reject(err.data);
		})

		return defer.promise;
	}

	this.user = null;
});