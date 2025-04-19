// client/app/dashboard/dashboard.js - Dashboard controller
angular.module('authApp.dashboard', [])

// File upload directive
.directive('fileModel', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      const model = $parse(attrs.fileModel);
      const modelSetter = model.assign;
      
      element.on('change', function() {
        scope.$apply(function() {
          modelSetter(scope, element[0].files[0]);
          
          // Add image preview
          if (element[0].files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
              scope.$apply(function() {
                scope.imagePreview = e.target.result;
              });
            };
            reader.readAsDataURL(element[0].files[0]);
          }
        });
      });
    }
  };
}])

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
    $scope.userId = user.id;
    
    // Form toggle
    $scope.showAddBookForm = false;
    $scope.isAddBookActive = false;
    
    $scope.toggleAddBookForm = function() {
      $scope.showAddBookForm = !$scope.showAddBookForm;
      $scope.isAddBookActive = !$scope.isAddBookActive;
    };
    
    // Initialize new book object
    $scope.newBook = {
      title: '',
      category: '',
      price: '',
      description: '',
      seller_id: $scope.userId
    };
    
    // Navigate to account page
    $scope.goToAccount = function() {
      $location.path('/account');
    };
    
    // Upload book
    $scope.uploadBook = function() {
      if (!$scope.coverImage) {
        alert('Please select a cover image');
        return;
      }
      
      // First upload the image
      var formData = new FormData();
      formData.append('cover_image', $scope.coverImage);
      
      $http({
        method: 'POST',
        url: '/api/books/upload-cover',
        headers: {
          'Content-Type': undefined,
          'x-access-token': token
        },
        data: formData,
        transformRequest: angular.identity
      }).then(function(response) {
        if (response.data.success) {
          // Now create the book with the image path
          $scope.newBook.cover_image = response.data.filePath;
          
          return $http({
            method: 'POST',
            url: '/api/books',
            headers: {
              'x-access-token': token
            },
            data: $scope.newBook
          });
        }
      }).then(function(response) {
        if (response && response.data.success) {
          // Reset form
          $scope.newBook = {
            title: '',
            category: '',
            price: '',
            description: '',
            seller_id: $scope.userId
          };
          $scope.coverImage = null;
          $scope.imagePreview = null;
          
          // Hide form and show success message
          $scope.showAddBookForm = false;
          $scope.isAddBookActive = false;
          alert('Book uploaded successfully!');
          
          // Refresh book list
          loadBooks();
        }
      }).catch(function(error) {
        console.error('Error uploading book:', error);
        alert('Error uploading book. Please try again.');
      });
    };
    
    // Load books
    function loadBooks() {
      $http({
        method: 'GET',
        url: '/api/books',
        headers: {
          'x-access-token': token
        }
      }).then(function(response) {
        if (response.data.success) {
          $scope.books = response.data.books;
        }
      }).catch(function(error) {
        console.error('Error fetching books:', error);
      });
    }
    
    // Initialize dashboard
    loadBooks();
  }]);