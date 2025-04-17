  // client/app/auth/auth.js - Authentication controller
  angular.module('authApp.auth', [])
  
  .controller('AuthController', ['$scope', '$http', '$window', '$location', '$rootScope', 
    function($scope, $http, $window, $location, $rootScope) {
      // Initialize user object
      $scope.user = {
        username: '',
        email: '',
        password: ''
      };
      
      // Error message
      $scope.error = null;
      
      // Login function
      $scope.login = function() {
        $http.post('/api/auth/signin', $scope.user)
          .then(function(response) {
            // Store token and user info
            $window.localStorage.setItem('token', response.data.token);
            $window.localStorage.setItem('user', JSON.stringify(response.data.user));
            $rootScope.isLoggedIn = true;
            
            // Redirect to dashboard
            $location.path('/dashboard');
          })
          .catch(function(error) {
            $scope.error = error.data.message || 'Login failed. Please try again.';
          });
      };
      
      // Register function
      $scope.register = function() {
        $http.post('/api/auth/signup', $scope.user)
          .then(function(response) {
            // Store token and user info
            $window.localStorage.setItem('token', response.data.token);
            $window.localStorage.setItem('user', JSON.stringify(response.data.user));
            $rootScope.isLoggedIn = true;
            
            // Redirect to dashboard
            $location.path('/dashboard');
          })
          .catch(function(error) {
            $scope.error = error.data.message || 'Registration failed. Please try again.';
          });
      };
  }]);