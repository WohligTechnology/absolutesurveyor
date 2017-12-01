connector.controller('AssignmentInfoCtrl', function ($scope, $ionicPopup, PopupService) {

    $scope.insideData = PopupService.assignmentObj;

    $scope.closePopup = function () {
        console.log("hiiii;.l,mnbvfc");
        PopupService.infoPopup.close();
    }
});

