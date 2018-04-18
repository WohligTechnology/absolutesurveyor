connector.controller('AppCtrl', function ($ionicPopup, $scope, $rootScope, MyServices, $ionicModal, $state, $timeout, $ionicHistory) {
  $scope.profile = $.jStorage.get('profile');
  // $rootScope.document = [];
  $scope.getprofile = function () {
    $scope.profile = $.jStorage.get('profile');
  };

  //to refresh page
  $scope.doRefresh = function () {
    $state.reload();
  };

  $scope.goBack = function () {
    var currentState = $state.current.name;
    if (currentState == "app.marineSurvey") {
      var myPopup = $ionicPopup.show({
        title: 'Are you sure you want to leave?',
        subTitle: "Your changes won't be saved",
        scope: $scope,

        buttons: [{
          text: 'Cancel'
        }, {
          text: '<b>Ok</b>',
          type: 'button-positive',
          onTap: function (e) {
            $ionicHistory.goBack();
          }
        }]
      });

      myPopup.then(function (res) {
        console.log('Tapped!', res);
      });

    } else {
      $ionicHistory.goBack();
    }
  };

  // $state.go($state.current, {}, { reload: true });
  $scope.logout = function () {
    var logoutData = {};
    logoutData.empId = $scope.profile._id;
    logoutData.deviceId = $rootScope.deviceId;
    MyServices.mobileLogout(logoutData, function (data) {
      if (data.value) {
        $.jStorage.set('profile', null);
        $.jStorage.deleteKey('profile');
        $.jStorage.flush();
        $state.go('login');
      }
    });

    if ($.jStorage.get('profile') === null) {
      $state.go('login');
    }


  };

});
