connector.controller('AppCtrl', function ($scope, $rootScope, MyServices, $ionicModal, $state, $timeout, $ionicHistory) {
    $scope.profile = $.jStorage.get('profile');
    // $rootScope.document = [];
    $scope.getprofile = function () {
        $scope.profile = $.jStorage.get('profile');
    };

    //to refresh page
    $scope.doRefresh = function () {
        $state.reload();
    }


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
        })



        if ($.jStorage.get('profile') === null) {
            $state.go('login');

        }


    };

})
