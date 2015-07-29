angular.module('BootCamper').controller('navCtrl', function($scope, $state, userServ){
	
	$scope.user = userServ.user;

	console.log('Current state:', $state);

	$scope.$on('user_changed', function(){
		console.log('user_changed -->', userServ.user);
		var user = userServ.user;
		if(user){
			$scope.user = user;
			if($scope.user.user_type.camper){
				$scope.isCamper = true;
			}else if($scope.user.user_type.client){
				$scope.isCamper = false;
			}
		}

		// if the camper has a project or not:
		// if (userServ.user.projects > 0) {	
		// 	$scope.camperHasProject = userServ.user.projects
		// }
	})

})