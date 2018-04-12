connector.controller('SubmitSurveyFormCtrl', function ($scope, $ionicPopup, PopupService, LocalStorageService, $ionicHistory) {

  var assignmentObj = PopupService.assignmentObj;

  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  if (month < 10) {
    month = '0' + month;
  }
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();
  $scope.maxDate = year + "-" + month + "-" + day;

  //To submit assigment object
  $scope.mobileSubmit = function (newuser) {
    newuser.surveyTime = new Date();
    $scope.document = _.cloneDeep(newuser);
    $scope.document.photos = assignmentObj.photos;
    $scope.document.doc = assignmentObj.doc;
    $scope.document.jir = assignmentObj.jir;
    $scope.document.assignId = assignmentObj.assignId;
    $scope.document.surveyId = assignmentObj.surveyId;
    $scope.document.status = assignmentObj.status;
    // $scope.document.latitude = $rootScope.latitude;
    // $scope.document.longitude = $rootScope.longitude;
    $scope.document.isMobile = assignmentObj.isMobile;
    LocalStorageService.addToLocalStorage($scope.document);
    PopupService.infoPopup.close();
    $ionicHistory.goBack(-2);
  }
});
