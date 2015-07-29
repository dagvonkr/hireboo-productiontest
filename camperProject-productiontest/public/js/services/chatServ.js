app.factory('Chat', function(FURL, $firebase, userServ, toaster, $q, $http){
	var ref = new Firebase(FURL);
	var user = {};
	userServ.read_user().then(function(data){
		user = data;
	},function(err){
		toaster.pop('error', "Something went wrong!");
	});


	var Chat = {
		chatMessages: function(projectId) {
			return $firebase(ref.child('chat').child(projectId)).$asArray();
		},

		addChatMessage: function(projectId, content) {
			var chatMessage = {};
			var chat_messages = Chat.chatMessages(projectId);
			chatMessage.datetime = Firebase.ServerValue.TIMESTAMP;
			chatMessage.content = content;
			chatMessage.gravatar = user.user_profile.profile_picture;
			chatMessage.name = user.user_profile.name;
			chatMessage.statue = true;

			if(chat_messages) {
				return chat_messages.$add(chatMessage);
			}
		},

		cancelProject: function(projectId) {
			$firebase(ref.child('chat').child(projectId)).$remove();
		},

		unBookProject: function(projectId) {
		var defer = $q.defer();
		    $http( {
		      method: 'PUT',
		      url: "/api/project/unbook/?id=" + projectId,
		    })
		    .then(function(data) {
		        defer.resolve(data);
		    });
		    return defer.promise;
		},

		finishProject: function(projectId){
			var shayScool = $q.defer();
			$http({
				method: 'PUT',
				url: "api/project/finish/?id=" + projectId
			}).then(function(res){
				if(res.status != 200){
					shayScool.reject(res);
				}else{
					shayScool.resolve(res);
				}
			});
				
			return shayScool.promise;
		}
	};
	return Chat;
});