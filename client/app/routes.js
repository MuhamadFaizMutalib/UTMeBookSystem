// client/app/routes.js - Angular routes
angular.module('authApp.routes', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
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
      controller: 'DashboardController'
    })
    .when('/account', {
      templateUrl: 'app/account/account.html',
      controller: 'AccountController'
    })
    .otherwise({ 
      redirectTo: '/login' 
    });
}]);