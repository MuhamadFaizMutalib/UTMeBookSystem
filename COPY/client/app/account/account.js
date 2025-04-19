// client/app/account/account.js - Account controller
angular.module('authApp.account', [])

.controller('AccountController', ['$scope', '$window', '$location', '$http',
  function($scope, $window, $location, $http) {
    // Initialize
    $scope.isLoading = true;
    $scope.error = null;
    $scope.user = {};
    
    // Get token from localStorage
    var token = $window.localStorage.getItem('token');
    
    if (!token) {
      $location.path('/login');
      return;
    }
    
    // Navigate back to dashboard
    $scope.goToDashboard = function() {
      $location.path('/dashboard');
    };
    
    // Fetch user profile data
    $scope.fetchUserProfile = function() {
      $scope.isLoading = true;
      $scope.error = null;
      
      $http({
        method: 'GET',
        url: '/api/auth/profile',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      }).then(function(response) {
        $scope.isLoading = false;
        $scope.user = response.data.user;
      }).catch(function(error) {
        $scope.isLoading = false;
        $scope.error = error.data ? error.data.message : 'Failed to fetch account details';
        
        // If unauthorized, redirect to login
        if (error.status === 401 || error.status === 403) {
          $window.localStorage.removeItem('token');
          $window.localStorage.removeItem('user');
          $location.path('/login');
        }
      });
    };
    
    // Initialize by fetching profile
    $scope.fetchUserProfile();
  }]);