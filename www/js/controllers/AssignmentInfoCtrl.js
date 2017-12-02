connector.controller('AssignmentInfoCtrl', function ($scope, $ionicPopup, PopupService) {

    $scope.insideData = PopupService.assignmentObj;

    $scope.closePopup = function () {
        PopupService.infoPopup.close();
    }
});

