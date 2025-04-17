// client/app/app.js - Main Angular module
angular.module('authApp', [
    'ngRoute',
    'ngAnimate',
    'authApp.routes',
    'authApp.auth',
    'authApp.dashboard'
  ])
  
  .run(['$rootScope', '$window', '$location', function($rootScope, $window, $location) {
    // Check if user is logged in
    $rootScope.isLoggedIn = !!$window.localStorage.getItem('token');
    
    // Logout function
    $rootScope.logout = function() {
      $window.localStorage.removeItem('token');
      $window.localStorage.removeItem('user');
      $rootScope.isLoggedIn = false;
      $location.path('/login');
    };
    
    // Check auth status on route change
    $rootScope.$on('$routeChangeStart', function(event, next) {
      if (next.requiresAuth && !$rootScope.isLoggedIn) {
        $location.path('/login');
      }
    });
  }]);
  
  

  
  

  
  

  
  

  
  
