connector.controller('TaskCtrl', function ($scope, $ionicPopup, $ionicNavBarDelegate, $state, $ionicLoading, MyServices, LocalStorageService, PopupService, $rootScope, $ionicPlatform) {

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

  //Save current state that will be used in photo doc page
  $.jStorage.set('currentState', $state.current.name);

  $rootScope.$on('proximityCatched', function () {
    $state.reload();
  });

  $scope.$on('$ionicView.enter', function (e) {
    $ionicNavBarDelegate.showBar(true);
  });

  $ionicPlatform.ready(function () {
    if (navigator.connection.type == Connection.NONE) {
      LocalStorageService.setOnlineStatus(false);
    } else {
      LocalStorageService.setOnlineStatus(true);
    };
    $scope.doRefresh(true);
  })
  // $scope.doRefresh(true);
  // LocalStorageService.setOnlineStatus(true);

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

  $scope.loadMore = function () {
    $scope.pagination.shouldLoadMore = false;
    $scope.pagination.currentPage++;
    var url = 'Assignment/tasklist';
    if (LocalStorageService.getOnlineStatus()) {
      MyServices.getData(url, {
        page: $scope.pagination.currentPage
      }, function (data) {
        $scope.pagination.result = _.concat($scope.pagination.result, data.data);
        if (data.data.length == 10) {
          $scope.pagination.shouldLoadMore = true;
        }
        LocalStorageService.isItLocalStorageData($scope.pagination.result);
        LocalStorageService.saveTaskOnLocalStorage($scope.pagination.result, "task");
        $scope.pagination.resultGroup = LocalStorageService.groupDataByMonth($scope.pagination.result);
        LocalStorageService.checkUploadStatusOfFile($scope.pagination.result);
        $scope.$broadcast('scroll.refreshComplete');
      });
    } else if (!LocalStorageService.getOnlineStatus()) {
      $scope.pagination.result = LocalStorageService.getTaskFromLocalStorage("task");
      LocalStorageService.isItLocalStorageData($scope.pagination.result);
      $scope.pagination.resultGroup = LocalStorageService.groupDataByMonth($scope.pagination.result);
      LocalStorageService.checkUploadStatusOfFile($scope.pagination.result);
    }
  };

  //To decline the task
  $scope.declineTask = function (surveyId, assignId) {
    PopupService.decline(surveyId, assignId);
  }

  //To get information of task 
  $scope.getInformation = function (value) {
    var url = 'templates/modal/info.html';
    PopupService.openModal(value, url);
  };

  //Go to survey page
  $scope.getSurveyPage = function (item) {
    if (item.getAllTaskStatus.survey != 'Done' && item.department == "Marine Cargo") {
      $state.go("app.marineSurvey", {
        assignId: item._id,
        surveyId: item.survey._id,
        department: item.department
      })
    } else {
      $state.go("app.photos-documents", {
        assignId: item._id,
        surveyId: item.survey._id,
        department: item.department
      })
    }
  }
})
