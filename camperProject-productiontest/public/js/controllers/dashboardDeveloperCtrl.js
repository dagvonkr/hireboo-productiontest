angular.module('BootCamper').controller('dashboardDeveloperCtrl', function($scope, $state, Upload,  user, userServ, $location){

	$state.user = user;
	$scope.user = user;

	var uniqueUserId = user._id;

	userServ.read_user().then(function(data){
       $scope.user = data;
     },function(err){
   });


	$scope.updateUserFn = function() {
		console.log('updateUser input-->', $scope.user)
		userServ.update_user($scope.user, uniqueUserId).then(function(res) {
			console.log('res-->', res);
			userServ.read_user().then(function(res) {
				$scope.user = res	
			})
		}, function(err){
			console.log('Got an error on updating user in Ctrl', err);
		})

		console.log('Unique user id:', uniqueUserId);
	}

	$scope.goToChatDev = function(id){
		$location.path('/camper_chat/' + id);
	}


	$scope.upload = function(files){
	    console.log(files);

	    if (files && files.length) {
	      for(var i = 0; i<files.length; i++){
	        
	        var file = files[i];

	        Upload.upload({
	          url: '/user/me/profile_picture',
	          fields: {'user': $scope.user._id},
	          file: file,
	          fileFormDataName: 'profile_picture'
	        }).progress(function(evt){
	          console.log('progress');
	        }).success(function(data, status, headers, config){
	          $scope.user = data;
	          
	          console.log('success');
	        })

	      }
	    }
	    
	  }
	

})