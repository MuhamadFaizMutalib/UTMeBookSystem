// client/app/app.js - Main angular module (continued)
angular.module('authApp', [
  'ngRoute',
  'authApp.routes',
  'authApp.auth',
  'authApp.dashboard',
  'authApp.account'
])

.run(['$rootScope', '$window', '$location', function($rootScope, $window, $location) {
  // Check if user is logged in
  $rootScope.checkAuth = function() {
    var token = $window.localStorage.getItem('token');
    var user = $window.localStorage.getItem('user');
    
    if (token && user) {
      $rootScope.isLoggedIn = true;
      $rootScope.currentUser = JSON.parse(user);
    } else {
      $rootScope.isLoggedIn = false;
      $rootScope.currentUser = null;
    }
    
    return $rootScope.isLoggedIn;
  };
  
  // Logout function
  $rootScope.logout = function() {
    $window.localStorage.removeItem('token');
    $window.localStorage.removeItem('user');
    $rootScope.isLoggedIn = false;
    $rootScope.currentUser = null;
    $location.path('/login');
  };
  
  // Initialize auth check
  $rootScope.checkAuth();
  
  // Check auth on route change
  $rootScope.$on('$routeChangeStart', function(event, next, current) {
    // Protected routes
    var protectedPaths = ['/dashboard', '/account'];
    
    // Check if route is protected and user is not logged in
    if (protectedPaths.indexOf($location.path()) !== -1 && !$rootScope.checkAuth()) {
      // Redirect to login
      $location.path('/login');
    }
  });
}]);