  // client/app/dashboard/dashboard.js - Dashboard controller
  angular.module('authApp.dashboard', [])
  
  .controller('DashboardController', ['$scope', '$window', '$location', 
    function($scope, $window, $location) {
      // Get user data from localStorage
      var user = JSON.parse($window.localStorage.getItem('user'));
      
      if (!user) {
        $location.path('/login');
        return;
      }
      
      $scope.username = user.username;
  }]);