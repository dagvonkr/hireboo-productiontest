angular.module('BootCamper').service('listingServ', function($http, $q) {


// getting listing obj from server 

  this.getListing = function(skip) {
    console.log(skip);  
    var defer = $q.defer();
    $http( {
      method: 'GET',
      url: "/api/project/available/" + skip,
    })
    .then(function(listingObj) {
      console.log(listingObj)
      if(listingObj.status === 404) {
        console.log("Listing error")
      } else {
        defer.resolve(listingObj.data)
      }
      defer.reject("Listing resolve error")
    });
    return defer.promise;
  }

  this.postListing = function(newProject) {
    console.log("This is a new project -->", newProject);
    var defer = $q.defer();
   $http({
      method: 'POST',
      url: "/api/project",
      data: newProject
    }).then(function (newProject) {
      // Here's the problem: I get the array in the service but I don't get it to be resolved.
     console.log('Heres the the new project resolved-->', newProject); 
     defer.resolve(newProject)
    });
    return defer.promise;
  }

  this.updateListing = function(updateProject, projectId) {
    console.log('updateProject in service -->', updateProject, projectId);
    var defer = $q.defer();
    $http({
      method: 'PUT',
      url: "/api/project/update/" + projectId,
      data: updateProject
    }).then(function(updateProject) {
      // Same problem, the examples is getting in the service, but can't be resolved.
      console.log('Resolved updateProject', updateProject);
      defer.resolve(updateProject)
    });
    return defer.promise;
  }

  this.removeList = function(projectId) {
    console.log("Removing product for listing --->", projectId)
    var defer = $q.defer();
    $http({
      method: 'PUT',
      url: "/api/project/book/?id=" + projectId
    }).then(function(res){
      defer.resolve(res);
    },function(err){
      defer.reject(err);
    })
    /*.then(function(res) {
      console.log(res.data);
      defer.resolve(res.data);
    }).catch(function(err) {
      console.log(err);
      defer.reject(err)
    })*/
    return defer.promise;
  }

  this.deleteProject = function (projectId) {
    console.log("Delete a project --->", projectId);
    var defer = $q.defer();
    $http({
      method: 'DELETE',
      url: '/api/project/delete/' + projectId
    }).then(function(res){
      defer.resolve(res);
    },function(err) {
      defer.reject(err)
    })
    return defer.promise;
  }



});