// client/app/components/navbar.js - Navigation controller
angular.module('authApp')

.controller('NavbarController', ['$scope', '$rootScope', '$window', '$location',
  function($scope, $rootScope, $window, $location) {
    // Check auth status whenever navbar loads
    $scope.checkAuth = function() {
      return $rootScope.checkAuth();
    };
    
    // Logout function
    $scope.logout = function() {
      $rootScope.logout();
    };
    
    // Initialize
    $scope.checkAuth();
  }]);