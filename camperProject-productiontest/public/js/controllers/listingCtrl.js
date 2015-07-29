angular.module('BootCamper').controller('listingCtrl', function($scope, $location, listingServ, projects){
  
  var skip = 5;
  $scope.listing = projects;
  $scope.scroll = false;


  $scope.show_scroll = function(){ 

  		if(!$scope.scroll){
  			console.log($scope.scroll);
	  		$scope.scroll = true;

		  	listingServ.getListing(skip).then(function(returnFromService) {

	

				if(returnFromService.length > 0){
					returnFromService.map(function(item, index){
						$scope.listing.push(item);
					})
					$scope.scroll = false;
					skip += 5;
				}else if(returnFromService.length < 1){
					$scope.scroll = true;
				}
		  	})
  		}


  }

  $scope.bookit = function(id) {
    listingServ.removeList(id).then(function(res){
      if(res.status == 400){
        console.log('fuck');
      }else{
        $location.path('/camper_chat/' +  res.data._id);
      }
    })
    
  }

 console.log("this is the entire listing", $scope.listing);


  

});