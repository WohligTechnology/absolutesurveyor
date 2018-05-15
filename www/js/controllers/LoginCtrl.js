connector.controller('LoginCtrl', function ($scope, $ionicPopup, $rootScope, $state, MyServices, $ionicLoading, $cordovaOauth) {
  $scope.showAlert = function () {
    var alertPopup = $ionicPopup.alert({
      title: 'oops!',
      template: 'Sorry You have entered wrong email '

    });

    alertPopup.then(function (res) {
      console.log('Thank you for not eating my delicious ice cream cone');
      // $state.go('app.task');
    });
  };
  $scope.formData = {};
  $scope.validEmail = /^[a-z]+[@][a-z]+[.]+[a-z]*$/;
  $scope.callAPI = function (email) {
    $scope.showLoading('Please wait...', 10000);
    $.jStorage.set('profile', null);
    $.jStorage.deleteKey('profile');
    $.jStorage.flush();
    MyServices.Login(email, function (err, data) {
      console.log("err", err, email);
      if (err) {
        $scope.hideLoading();
        $scope.showAlert();
      } else {
        $scope.hideLoading();
        $rootScope.taskpending = [];
        $.jStorage.set('profile', data.data);
        $state.go('app.task');
      }
    });
  };

  //To get device id before login
  $scope.login = function (loginData) {
    $scope.showLoading('Please wait...', 15000);
    if (window.plugins) {
      if (window.plugins.OneSignal) {
        window.plugins.OneSignal.getIds(function (ids) {
          loginData.deviceId = ids.userId;
          $rootScope.deviceId = ids.userId;
          if (loginData.deviceId) {
            $scope.callAPI(loginData);
          } else {
            $scope.callAPI(loginData);
          }
        });
      }
    } else {
      $scope.callAPI(loginData);
    }
  };


  $scope.showLoading = function (value, time) {
    $ionicLoading.show({
      template: value,
      duration: time
    });
  };
  $scope.hideLoading = function () {
    $ionicLoading.hide();
  };
})
