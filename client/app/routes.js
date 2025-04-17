  // client/app/routes.js - Angular routes
  angular.module('authApp.routes', [])
  
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        redirectTo: '/login'
      })
      .when('/login', {
        templateUrl: 'app/auth/login.html',
        controller: 'AuthController'
      })
      .when('/register', {
        templateUrl: 'app/auth/register.html',
        controller: 'AuthController'
      })
      .when('/dashboard', {
        templateUrl: 'app/dashboard/dashboard.html',
        controller: 'DashboardController',
        requiresAuth: true
      })
      .otherwise({
        redirectTo: '/login'
      });
      
    $locationProvider.hashPrefix('!');
  }]);