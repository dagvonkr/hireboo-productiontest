
angular.module('BootCamper')
	.controller('camperChatCtrl', function($scope, $stateParams, $location, userServ, paymentServ, Chat, projectServ){


		$scope.error;
		$scope.card = {
			number: null,
			cvc: null,
			expMonth: null,
			expYear: null
		}


		userServ.read_user().then(function(data){
			$scope.user = data;
		},function(err){
		});


		projectServ.getProject($stateParams.projectId).then(function(data){
			$scope.project = data;
			$scope.pay = !$scope.project.status.paid;
			},function(err){
		});
		
		//Return chat messages
		if($stateParams.projectId) {
			$scope.projectId = $stateParams.projectId;
			$scope.chats = Chat.chatMessages($stateParams.projectId);
		}

		//Adding comment to the chat
		$scope.addChatMessage = function(projectId, content) {
			Chat.addChatMessage(projectId, content);
			$scope.content = '';
		};

		$scope.cancelProject = function(projectId) {
			Chat.cancelProject(projectId);
			Chat.unBookProject(projectId);
			if($scope.user.user_type.client) {
				$location.path('/dashboard-client/active');
			}
			else {
				$location.path('/camper-listing');
			}
		};

		$scope.finishProject = function(projectId) {
			Chat.finishProject(projectId).then(function(res){
				if($scope.user.user_type.client) {
					$location.path('/dashboard-client/active');
				}
				else {
					$location.path('/camper-listing');
				}
			}).catch(function(res){
				console.log('error');
			})
		};

		$scope.pay = true;

		$scope.isPayed = function() {
			 $scope.user=userServ.user;
			 if($scope.user){
				if($scope.user.user_type.camper){
					console.log("is payed = false")
					return true;
				}else{
					console.log("is payed = false")
					return false;
				}
			 }else{
			 	console.log("no user?")
			 	return false;
			 }
		};

		

		$scope.stripeCallback = function(code, result){
			if(result.error){
				$scope.error = result.error.message;
			}else {
				projectServ.paid($scope.project._id).then(function(res){
					projectServ.getProject($scope.project._id).then(function(dat){
						$scope.project = dat;
					})
					$scope.pay = false;
				}).catch(function(err){
					console.log('project status not updated');
				})
				alert('success!');
			}
		}
	})