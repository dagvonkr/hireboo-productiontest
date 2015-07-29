'use strict';

var app = angular
  .module('BootCamper', [
    'ngAnimate',    
    'ngResource',
    'ui.router',    
    'firebase',
    'toaster',
    'angularMoment',
    'infinite-scroll',
    'ngFileUpload',
    'angularPayments'
  ])
  .constant('FURL', 'https://camperproject.firebaseio.com/')
  .run(function($rootScope, $location, userServ) {
   $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
      // We can catch the error thrown when the $requireAuth promise is rejected
      // and redirect the user back to the login page
      if (error === "AUTH_REQUIRED") {
        console.log("you need to be loged in dude");
        $location.path("/login");
      }
    });

    //get User state
    userServ.read_user();
    


  })  
  .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

    Stripe.setPublishableKey('pk_test_PYauQQT3rJCNBXjMqckwcEIN')
    

    
    $urlRouterProvider.otherwise('/')

    $stateProvider  


      .state('landingpage', {
        url: '/',
        templateUrl: '/views/landing-page.html'     
      })

      .state('browse', {
        url: '/browse/:taskId',
        templateUrl: '',
        controller: ''
      })



//register pages (2) ============================================

  //camper
      .state('register_camper', {
        url: '/register_camper',
        templateUrl: '/views/register_camper/register.html',
        controller: 'userCtrl',
        resolve: {
          school: function(schoolServ){
            return schoolServ.read_schools();
          }
        }
      })

            .state('register_camper.login_info', {
              url: '/login_info', 
              templateUrl: '/views/register_camper/login_info.html', 
              
            })
            .state('register_camper.profile', {
              url: '/profile', 
              templateUrl: '/views/register_camper/profile.html',  
            })
            .state('register_camper.skills',{
              url: '/skills',
              templateUrl: '/views/register_camper/skills.html'
            })
            .state('register_camper.school', {
              url: '/school',
              templateUrl: '/views/register_camper/school.html'
            })
            .state('register_camper/profile_picture', {
              url: '/profile_picture', 
              templateUrl: '/views/register_camper/profile_picture.html', 
              
            })



  //client
      .state('register_client', {
        url: '/register_client',
        templateUrl: '/views/register_client/register.html',
        controller: 'userCtrl',
        resolve: {
          school: function(schoolServ){
            return schoolServ.read_schools();
          }
        }
      })  
          .state('register_client.login_info', {
            url: '/client_login',
            templateUrl: '/views/register_client/login_info.html'
            // controller: 'userCtrl',
          })

          .state('register_client.profile', {
            url: '/client_profile',
            templateUrl: '/views/register_client/profile.html'
          })
              





//--------------------------------------------------------------------
//Chat page =============================================
      .state('camper_chat', {
        url: '/camper_chat/:projectId',
        templateUrl: '/views/camper-chat.html',
        controller: 'camperChatCtrl'
/*        resolve {
          project: function(projectServ, $stateParams){
            return projectServ.getProject()
          }
        }*/
      })
//-------------------------------------------------------

//login page   ==========================================
      .state('login', {
        url: '/login',
        templateUrl: '/views/login.html',
        controller: 'userCtrl',
        resolve: {
          school: function(schoolServ){
            return schoolServ.read_schools();
          }
        }
      })


      .state('password-recover', {
        url: '/password',
        templateUrl: '/views/password-recover.html',
        controller: 'passwordCtrl'
      })

      
//-----------------------------------------------------------

//listings page   ==========================================
      .state('camper-listing', {
        url: '/camper-listing',
        templateUrl: '/views/camper-listing.html',
        controller: 'listingCtrl',
        resolve: {
          projects: function(listingServ) {
            return listingServ.getListing(0);
          }
        }
      })
//-----------------------------------------------------------


// Client

    .state('dashboard-client', {
        url: '/dashboard-client',
        templateUrl: '/views/client-dashboard-tabs.html',
        controller: 'dashboardClientCtrl',
        resolve: {
          user: function(userServ){
            return userServ.read_client();
          }
        }
      })

      .state('dashboard-client.settings', {
          url: '/settings',
          templateUrl: '/views/client-dashboard.html',
          controller: 'dashboardClientCtrl'
      })

      .state('dashboard-client.active', {
          url: '/active',
          templateUrl: '/views/client-dashboard-postProject.html',
          controller: 'dashboardClientCtrl'
       })

// developer
      .state('dashboard-developer', {
        url: '/dashboard-developer',
        templateUrl: '/views/camper-dashboard-tabs.html',
        controller: 'dashboardDeveloperCtrl',
        resolve: {
          user: function(userServ){
            console.log('resolve developer: ')
            return userServ.read_camper();
          }
        }
      })

        .state('dashboard-developer.settings', {
          url: '/settings',
          templateUrl: '/views/camper-dashboard.html'
        })

        .state('dashboard-developer.active', {
          url: '/active',
          templateUrl: '/views/camper-active-project.html'
        })

        .state('dashboard-developer.finish', {
          url: '/finish',
          templateUrl: '/views/camper-finish-project.html'
        })



        $httpProvider.interceptors.push(function($location){
          return {
            'responseError': function(res){
              if(res.status === 401){
                $location.path('/login');
              }
              return res;
            }
          }
        })

        
  });
  

