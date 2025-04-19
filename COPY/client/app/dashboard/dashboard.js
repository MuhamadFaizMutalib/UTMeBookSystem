// client/app/dashboard/dashboard.js - Dashboard controller
angular.module('authApp.dashboard', [])

.controller('DashboardController', ['$scope', '$window', '$location', '$http',
  function($scope, $window, $location, $http) {
    // Get user data from localStorage
    var user = JSON.parse($window.localStorage.getItem('user'));
    var token = $window.localStorage.getItem('token');
    
    if (!user || !token) {
      $location.path('/login');
      return;
    }
    
    $scope.username = user.username;
    $scope.userRole = user.role;
    
    // Navigate to account page
    $scope.goToAccount = function() {
      $location.path('/account');
    };
    
    // You could load more dashboard data here if needed
    $scope.loadDashboardData = function() {
      // Example: fetch any dashboard data needed
    };
    
    // Initialize dashboard
    $scope.loadDashboardData();
  }]);