angular.module('BootCamper').service('projectServ', function($http, $q) {


// getting listing obj from server 

  this.getProject = function(projectId) {
    
    var defer = $q.defer();

    $http( {
      method: 'GET',
      url: "/api/project/read/?id=" + projectId,

    })
    .then(function(ProjectObj) {
      console.log(ProjectObj)

      if(ProjectObj.status === 404) {
        console.log("Listing error")
      } else {
        defer.resolve(ProjectObj.data)
      }

      defer.reject("Listing resolve error")

    });

    return defer.promise;

  };

  this.paid = function(id){
    var der = $q.defer();

    $http({
      method:"PUT",
      url:"/api/project/paid/" + id
    }).then(function(res){
      if(res.status != 200){
        der.reject(res);
      }else{
        der.resolve(res);
      }
    })

    return der.promise;
  }

});