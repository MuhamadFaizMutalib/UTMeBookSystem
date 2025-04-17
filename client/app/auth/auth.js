// client/app/auth/auth.js - Authentication controller
angular.module('authApp.auth', [])

.controller('AuthController', ['$scope', '$http', '$window', '$location', '$rootScope', '$timeout',
  function($scope, $http, $window, $location, $rootScope, $timeout) {
    // Initialize user object
    $scope.user = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      otp: ''
    };
    
    // Error message
    $scope.error = null;
    $scope.otpSent = false;
    $scope.currentStep = 1; // Step 1: Email, Step 2: OTP, Step 3: Password
    
    // Step one submission - username and email
    $scope.stepOneSubmit = function() {
      // Check if email already exists
      $http.post('/api/auth/check-email', { email: $scope.user.email })
        .then(function(response) {
          if (response.data.exists) {
            $scope.error = 'This email is already registered. Please use a different email or log in.';
          } else {
            // Email is available, send OTP
            $scope.sendOtp();
          }
        })
        .catch(function(error) {
          $scope.error = error.data.message || 'Failed to check email. Please try again.';
        });
    };
    
    // Send OTP
    $scope.sendOtp = function() {
      $http.post('/api/auth/send-otp', { email: $scope.user.email, username: $scope.user.username })
        .then(function(response) {
          $scope.error = null;
          $scope.otpSent = true;
          $scope.currentStep = 2;
          
          // Clear OTP notification after 5 seconds
          $timeout(function() {
            $scope.otpSent = false;
          }, 5000);
        })
        .catch(function(error) {
          $scope.error = error.data.message || 'Failed to send verification code. Please try again.';
        });
    };
    
    // Resend OTP
    $scope.resendOtp = function() {
      $scope.sendOtp();
    };
    
    // Verify OTP
    $scope.verifyOtp = function() {
      $http.post('/api/auth/verify-otp', { email: $scope.user.email, otp: $scope.user.otp })
        .then(function(response) {
          $scope.error = null;
          $scope.currentStep = 3; // Move to password creation step
        })
        .catch(function(error) {
          $scope.error = error.data.message || 'Invalid verification code. Please try again.';
        });
    };
    
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
    
    // Register function - final step
    $scope.register = function() {
      $http.post('/api/auth/signup', {
        username: $scope.user.username,
        email: $scope.user.email,
        password: $scope.user.password,
        otp: $scope.user.otp
      })
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