angular.module('BootCamper').controller('dashboardClientCtrl', function($scope, $state, Upload,  user, userServ, listingServ, $location){

$scope.file = '';
 $scope.newProject = {
  description: {
    examples: []
  }
 }
  $scope.user = user;
  $scope.edit_picture = false;

  var uniqueUserId = user._id;
  
  console.log('Client user: ', $scope.user);
  

 
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
          console.log(data);
          $scope.user = data;
           
          console.log('success');
        })

      }
    }
    
  }



	// Running the update user info
  $scope.updateClient = function() {
    console.log('updateUser input-->', $scope.user)
    $scope.editing = false;

    
    userServ.update_user($scope.user, uniqueUserId).then(function(res) {
      console.log('res-->', res);
      userServ.read_user().then(function(res) {
        console.log('res ====>', res);
        $scope.user = res;
      })
    }, function(err){
      console.log('Got an error on updating user in Ctrl', err);
    })

    console.log('Unique user id:', uniqueUserId);
  }

  // Submiting a new project
  $scope.submitProject = function(newProject) {
    console.log('newProject', newProject)

    // console.log("new Project posting --->", newProject)
    // console.log($scope.user._id);
    newProject["client_poster"] = uniqueUserId
    listingServ.postListing(newProject).then(function(res) {

      console.log ("listing res --->", res)

      userServ.read_user().then(function(res) {
        $scope.user = res;
        $scope.newProject = {};
      })
    }, function(err){
      console.log('Got an error on updating user in Ctrl', err);
    })
  }

  // Update project
  var projectId;
  $scope.projectShow
  $scope.editingProjects = false;

  $scope.currentProject = function(project) {
    $scope.editingProjects = !$scope.editingProjects;
    $scope.projectShow = project
    projectId = $scope.projectShow._id;
    console.log('ID', projectId);
  }

  $scope.updateProjectFn = function(updateProject) {
    console.log('Updated project object -->', updateProject);
    listingServ.updateListing(updateProject, projectId).then(function(res) {
      console.log('The result of the controller callback -->', res);

      userServ.read_user().then(function(res) {
        $scope.user = res;
        $scope.editingProjects = false;
      })
      // Resolved and comming back so it can be postet on the scope
    }).catch(function(err) {
      console.log('Error!!', err);
    })
  }


  $scope.goToChat = function(id) {
    $location.path('/camper_chat/' + id);
  }

  $scope.deleteProject = function(id) {
    console.log('this is the project ID to delete ---->', id._id)
    listingServ.deleteProject(id._id).then(function(res) {
      if(res.status !== 200) {
        console.log('shat didnt delete ---->')
      } else {
        var del = $scope.user.projects.indexOf(id)
        $scope.user.projects.splice(del, 1);
        // $scope.user = userServ.read_user();
      }    
    });
  }


})

