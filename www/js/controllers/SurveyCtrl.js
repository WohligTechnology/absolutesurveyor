connector.controller('SurveyCtrl', function ($scope, $ionicScrollDelegate) {
    $scope.toggleGroup = function (group) {
        if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = group;
        }
        $ionicScrollDelegate.resize();
        $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
    };
    $scope.isGroupShown = function (group) {
        return $scope.shownGroup === group;
    };
})