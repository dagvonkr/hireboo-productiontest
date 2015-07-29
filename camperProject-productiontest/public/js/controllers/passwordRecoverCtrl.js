angular.module('BootCamper').controller('passwordCtrl', function($scope, $state, passwordServ, userServ){

	var code;
	var thisuser;
	var usertype;
	$scope.varified = false;

	$scope.send_varification = function(){
		$scope.error = '';
		$scope.error2 = '';
		$scope.varify.codeEntered='';
		console.log($scope.user)
		passwordServ.send_reset_email($scope.user).then(function(res){
			
			console.log('send_varification=====>', res);
			code = res.message;
			thisuser = res.user;
			console.log('thisuser=============>', thisuser);
			$scope.sent_email = !$scope.sent_email;
		}).catch(function(err){
			console.log('send_varification=====>', err);
			$scope.error = err.message;
			$scope.user = {};
		})
	}

	$scope.varify = function(){
		
		
		if($scope.varify.codeEntered){
			var codes = {
				given: code,
				entered: $scope.varify.codeEntered
			};
			console.log(codes)
			passwordServ.varify(codes).then(function(res){

				console.log('varify==============>', res);
				$scope.varified = true;

			}).catch(function(err){

				console.log('varify==============>', err);
				$scope.error = err.message;
				$scope.user = {};
				$scope.sent_email = false;

			})

		}else{
			$scope.error = "you must enter a code!"
		}
	}

	$scope.reset_password = function(){
		if($scope.user.password_confirm === $scope.user.password){


			var user = {
				login:{
					local:{
						email: thisuser.login.local.email,
						password:$scope.user.password
					}
				}
			};

			userServ.update_user(user, thisuser._id).then(function(res){
				console.log(res);
				/*if(thisuser.user_type.client){
					$state.go('dashboard-client');
				}else if(thisuser.user_type.camper){
					$state.go('dashboard-developer');
				}*/

			}).catch(function(err){
				$scope.error = err.message;
			})
		}

		
	}
})
