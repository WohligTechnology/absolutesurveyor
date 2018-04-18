//To show all history of user
connector.controller('HistoryCtrl', function ($scope, $ionicPopup, $ionicNavBarDelegate, $state, MyServices, $timeout, $ionicLoading, LocalStorageService, PopupService, $rootScope) {

  $scope.profile = MyServices.getProfile();

  $scope.doRefresh = function (val) {
    $scope.pagination = {
      shouldLoadMore: true,
      currentPage: 0,
      result: []
    };
    if (!val) {
      $scope.loadMore();
    }
  };
  $scope.doRefresh(true);


  $rootScope.$on('proximityCatched', function () {
    $state.reload();
  });

  $scope.$on('$ionicView.enter', function (e) {
    $ionicNavBarDelegate.showBar(true);
  });

  //To select the surveyor 
  $scope.getSurveyour = function (value) {
    $state.go('app.selectSurveyor', {
      lat: value.lat,
      lng: value.lng,
      assignId: value._id,
      surveyId: value.survey._id,
      currentEmpId: value.survey.employee
    });
  };

  $scope.$on('$ionicView.enter', function (e) {
    $ionicNavBarDelegate.showBar(true);
  });

  $scope.loadMore = function () {
    $scope.pagination.shouldLoadMore = false;
    $scope.pagination.currentPage++;
    var url = 'Assignment/tasklistCompleted';
    if (LocalStorageService.getOnlineStatus()) {
      MyServices.getData(url, {
        page: $scope.pagination.currentPage
      }, function (data) {
        $scope.pagination.result = _.concat($scope.pagination.result, data.data);
        if (data.data.length == 10) {
          $scope.pagination.shouldLoadMore = true;
        }
        LocalStorageService.isItLocalStorageData($scope.pagination.result);
        LocalStorageService.saveTaskOnLocalStorage($scope.pagination.result, "history");
        $scope.pagination.resultGroup = LocalStorageService.groupDataByMonth($scope.pagination.result);
        $scope.$broadcast('scroll.refreshComplete');
        LocalStorageService.checkUploadStatusOfFile($scope.pagination.result);
      });
      console.log("1");
    } else if (!LocalStorageService.getOnlineStatus()) {
      $scope.pagination.result = LocalStorageService.getTaskFromLocalStorage("history");
      LocalStorageService.isItLocalStorageData($scope.pagination.result);
      $scope.pagination.resultGroup = LocalStorageService.groupDataByMonth($scope.pagination.result);
      LocalStorageService.checkUploadStatusOfFile($scope.pagination.result);
    }

  };

  $scope.declineTask = function (surveyId, assignId) {
    PopupService.decline(surveyId, assignId);
  };

  //To get information of task 
  $scope.getInformation = function (value) {
    var url = 'templates/modal/info.html';
    PopupService.openModal(value, url);
  };

});
