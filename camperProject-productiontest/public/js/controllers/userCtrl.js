angular.module('BootCamper').controller('userCtrl', function($scope, $state, userServ, schoolServ, school){

	$scope.error;
	$scope.states = {
	    "AL": "Alabama",
	    "AK": "Alaska",
	    "AS": "American Samoa",
	    "AZ": "Arizona",
	    "AR": "Arkansas",
	    "CA": "California",
	    "CO": "Colorado",
	    "CT": "Connecticut",
	    "DE": "Delaware",
	    "DC": "District Of Columbia",
	    "FM": "Federated States Of Micronesia",
	    "FL": "Florida",
	    "GA": "Georgia",
	    "GU": "Guam",
	    "HI": "Hawaii",
	    "ID": "Idaho",
	    "IL": "Illinois",
	    "IN": "Indiana",
	    "IA": "Iowa",
	    "KS": "Kansas",
	    "KY": "Kentucky",
	    "LA": "Louisiana",
	    "ME": "Maine",
	    "MH": "Marshall Islands",
	    "MD": "Maryland",
	    "MA": "Massachusetts",
	    "MI": "Michigan",
	    "MN": "Minnesota",
	    "MS": "Mississippi",
	    "MO": "Missouri",
	    "MT": "Montana",
	    "NE": "Nebraska",
	    "NV": "Nevada",
	    "NH": "New Hampshire",
	    "NJ": "New Jersey",
	    "NM": "New Mexico",
	    "NY": "New York",
	    "NC": "North Carolina",
	    "ND": "North Dakota",
	    "MP": "Northern Mariana Islands",
	    "OH": "Ohio",
	    "OK": "Oklahoma",
	    "OR": "Oregon",
	    "PW": "Palau",
	    "PA": "Pennsylvania",
	    "PR": "Puerto Rico",
	    "RI": "Rhode Island",
	    "SC": "South Carolina",
	    "SD": "South Dakota",
	    "TN": "Tennessee",
	    "TX": "Texas",
	    "UT": "Utah",
	    "VT": "Vermont",
	    "VI": "Virgin Islands",
	    "VA": "Virginia",
	    "WA": "Washington",
	    "WV": "West Virginia",
	    "WI": "Wisconsin",
	    "WY": "Wyoming"
	};
	$scope.schools = school;
	$scope.user = {};

	$scope.logged_in = false; 
	$scope.user_exist= false;
	$scope.no_profile = true;
	$scope.register_err = false;
	$scope.newEmail = false;

	console.log($scope.schools);

	function setFocus(){
		console.log("setting focus");
		document.getElementById("email").focus()
	}



	$scope.register_camper = function() {
		
		$scope.user["user_type"] = {
			camper: true
		}
		if($scope.user.login.local.email && $scope.user.login.local.password){

			console.log('email', $scope.user.login.local.email);
			
			userServ.register($scope.user).then(function(res) {
				var id = res.data._id;
				console.log('userserv.register=============>', res.status);
				if(res.status != 200){

					console.log('error registering=====>',res.data);

					$scope.error = res.data.message;

					delete $scope.user.login;
					
				}else{
					userServ.login($scope.user.login.local).then(function(res){
						console.log('userServ.login=======>', res.status);
						if(res.status != 200){
							$scope.logged_in = false;
							$scope.error = res;
						}else{

							$scope.user["_id"] = id;
							$scope.logged_in = true;
							$state.go('register_camper.profile');
						}

					});	
				}
			})
		}
			
	}; 

	$scope.register_client = function() {

		$scope.user["user_type"] = {
			client: true
		}
		if($scope.user.login.local.email && $scope.user.login.local.password){

			console.log('email', $scope.user.login.local.email);
			
			userServ.register($scope.user).then(function(res) {
				var id = res.data._id;
				console.log('userserv.register=============>', res.status);
				if(res.status != 200){

					console.log('error registering=====>',res.data);

					$scope.error = res.data.message;

					delete $scope.user.login;
					
				}else{
					userServ.login($scope.user.login.local).then(function(res){
						console.log('userServ.login=======>', res.status);
						if(res.status != 200){
							$scope.logged_in = false;
							$scope.error = res;
						}else{

							$scope.user["_id"] = id;
							$scope.logged_in = true;
							$state.go('register_client.profile');
						}

					});	
				}
			})
		}

	};



	$scope.login = function() {
		console.log($scope.user);
		
		var login = {
			email: $scope.user.login.local.email,
			password: $scope.user.login.local.password
		};

		userServ.login(login).then(function(res){
			console.log(res);
			if(res.status != 200){
				console.log(res);
				$scope.error = res.data.message;
				
			}else{
				if(res.data.user_type.camper){
					$state.go('dashboard-developer.active');
				}else{
					$state.go('dashboard-client.active');
				}
			}
		})
		$scope.user = {};	
		
	};

	$scope.save_user = function(){
		delete $scope.user.login;
		console.log($scope.user);

		if($scope.logged_in){
			userServ.update_user($scope.user, $scope.user._id).then(function(res){
				console.log(res.data);
				console.log(res);
				if(res.data.user_type.client){
					var whereTo = "dashboard-client.active"
				}else{
					var whereTo = "dashboard-developer.active"
				}
				$state.go(whereTo);
			})
		}else{
			$state.go('landingpage');
		}
	}

	$scope.clear = function(){
		$scope.user = {};
		$scope.user_exist = false;
		$scope.error = '';
	}


});