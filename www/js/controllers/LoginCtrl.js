connector.controller('LoginCtrl', function ($scope, $ionicPopup, $rootScope, $state, MyServices, $ionicLoading, $cordovaOauth) {
    $scope.profile = {};
    $scope.profile = $.jStorage.get('profile');
    if ($scope.profile) {
        $state.go('app.task');
    }


    // $scope.login = function() {
    //   console.log("hi");
    //     $cordovaOauth.google("AIzaSyDEckQh5-njghsAhWUs1gT6qjIfmuqlpOo", ["https://www.googleapis.com/auth/urlshortener", "https://www.googleapis.com/auth/userinfo.email"]).then(function(result) {
    //         console.log(JSON.stringify(result));
    //     }, function(error) {
    //         console.log(error);
    //     });
    // }

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
        MyServices.Login(email, function (data) {
            if (data.value) {
                $scope.hideLoading();
                $rootScope.taskpending = [];
                $.jStorage.set('profile', data.data);
                $state.go('app.task');
            } else {
                $scope.hideLoading();
                $scope.showAlert();
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