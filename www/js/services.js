var adminurl = "http://wohlig.io/api/"; //local

// var adminurl = "http://104.198.28.29:80/api/"; //server 
// var adminurl = "http://35.185.181.141:80/api/"; //Test server
// var adminurl = "http://absolutesurveyors.com/api/"; //server

// var imgpath = adminurl + "uploadfile/getupload?file=";
var imgurl = adminurl + "upload/";
var imgpath = imgurl + "readFile?file=";
// var uploadurl = imgurl;

angular.module('starter.services', [])
  .factory('MyServices', function ($http) {
    return {
      Login: function (email, callback) {
        $http({
          url: adminurl + 'Employee/getLoginSurveyor',
          method: 'POST',
          withCredentials: true,
          data: email
        }).success(callback);
      },
      Task: function (data, callback) {
        // console.log(id);
        // var data = {
        //   id: id
        // };
        $http({
          url: adminurl + 'Assignment/tasklist',
          method: 'POST',
          withCredentials: true,
          data: data
        }).success(callback);
      },

      //To get History 
      History: function (data, callback) {
        // console.log(id);
        // var data = {
        //   id: id
        // };
        $http({
          url: adminurl + 'Assignment/tasklistCompleted',
          method: 'POST',
          withCredentials: true,
          data: data
        }).success(callback);
      },

      Decline: function (data, callback) {

        $http({
          url: adminurl + 'Assignment/decline',
          method: 'POST',
          withCredentials: true,
          data: data
        }).success(callback);
      },
      mobileSubmit: function (data, callback) {

        $http({
          url: adminurl + 'Assignment/mobileSubmit',
          method: 'POST',
          withCredentials: true,
          data: data
        }).success(callback);
      },

      mobileLogout: function (data, callback) {

        $http({
          url: adminurl + 'Employee/mobileLogout',
          method: 'POST',
          withCredentials: true,
          data: data
        }).success(callback);
      },

    }
  })

  //Service for background task
  // .factory('bgService', function (MyServices,$http) {

  //   // function uploadData(value, i, callback) {
  //   //   $scope.document = value;
  //   //   console.log($scope.document.status);
  //   //   if (!value.status) {
  //   //     $rootScope.taskpending[i].status = true;
  //   //     console.log(value);
  //   //     console.log($scope.document);
  //   //     $scope.photos = _.cloneDeep($scope.document.photos);
  //   //     $scope.doc = _.cloneDeep($scope.document.doc);
  //   //     $scope.jir = _.cloneDeep($scope.document.jir);
  //   //     console.log($scope.photos);
  //   //     console.log($scope.doc);
  //   //     console.log($scope.jir);
  //   //     async.parallel({
  //   //       photos: function (callback) {
  //   //         async.each(_.flatten($scope.photos), function (value, callback) {
  //   //           console.log(value);
  //   //           uploadImage(value, 'photos', callback);

  //   //         }, function (err, data) {
  //   //           callback(null, data);
  //   //         });
  //   //       },
  //   //       document: function (callback) {
  //   //         async.each(_.flatten($scope.doc), function (value, callback) {
  //   //           console.log(value);
  //   //           uploadImage(value, 'Document', callback);

  //   //         }, function (err, data) {
  //   //           callback(null, data);
  //   //         });
  //   //       },
  //   //       jir: function (callback) {
  //   //         async.each(_.flatten($scope.jir), function (value, callback) {
  //   //           console.log(value);
  //   //           uploadImage(value, 'JIR', callback);

  //   //         }, function (err, data) {
  //   //           callback(null, data);
  //   //         });
  //   //       }
  //   //     }, function (err, data) {
  //   //       $scope.document.photos = [];
  //   //       $scope.document.doc = [];
  //   //       $scope.document.jir = [];
  //   //       $scope.document.photos.length = 0;
  //   //       console.log("done");
  //   //       // $scope.photos1 = _.flatten($scope.photos);
  //   //       _.forEach($scope.photos1, function (value) {
  //   //         $scope.document.photos.push({
  //   //           "file": value
  //   //         });
  //   //       });
  //   //       //doc
  //   //       $scope.document.doc.length = 0;
  //   //       // $scope.doc1 = _.flatten($scope.doc);
  //   //       _.forEach($scope.doc1, function (value) {
  //   //         $scope.document.doc.push({
  //   //           "file": value
  //   //         });
  //   //       });
  //   //       //jir
  //   //       $scope.document.jir.length = 0;
  //   //       // $scope.jir1 = _.flatten($scope.jir)
  //   //       _.forEach($scope.jir1, function (value) {
  //   //         $scope.document.jir.push({
  //   //           "file": value
  //   //         });
  //   //       });
  //   //       console.log("hry", $scope.document);
  //   //       MyServices.mobileSubmit($scope.document, function (data) {
  //   //         if (data.value) {
  //   //           console.log(data);
  //   //           $scope.taskcomplete.push($scope.document);
  //   //           $scope.photos = [];
  //   //           $scope.doc = [];
  //   //           $scope.jir = [];
  //   //           $scope.photos1 = [];
  //   //           $scope.doc1 = [];
  //   //           $scope.jir1 = [];
  //   //           // _.remove($rootScope.document, function(n) {
  //   //           //   return  n.assignId==$scope.document.assignId;
  //   //           // });
  //   //           // $rootScope.taskpending.shift();
  //   //           callback(null, $scope.taskcomplete);
  //   //         } else {
  //   //           console.log(data.value);
  //   //           callback(null, data);
  //   //         }
  //   //       });

  //   //     });
  //   //   }
  //   // }



  //   return {
  //     init: function () {
  //       // cordova.plugins.backgroundMode is now available
  //       //For background mode
  //       cordova.plugins.backgroundMode.setDefaults({
  //         title: "Absolute",
  //         text: "String",
  //         icon: 'icon', // this will look for icon.png in platforms/android/res/drawable|mipmap
  //         color: "F14F4D", // hex format like 'F14F4D'
  //         resume: true,
  //         hidden: false,
  //         bigText: false
  //       })

  //       //  if ($rootScope.isOnline) {
  //       //  $rootScope.shouldUpload = true;

  //       //   if ($rootScope.shouldUpload) {

  //       //     $rootScope.shouldUpload = false;
  //       //     // debugger;
  //       //     var i = 0;
  //       //     async.eachSeries(_.cloneDeep($rootScope.taskpending), function (value, callback) {

  //       //       uploadData(value, i, function (err, data) {
  //       //         if (err) {
  //       //           callback(err);
  //       //         } else {
  //       //           $rootScope.taskpending.shift();
  //       //           console.log("$rootScope.taskpending", $rootScope.taskpending);
  //       //           callback(null, data);
  //       //         }
  //       //       });
  //       //       i++;
  //       //     }, function (err, data) {
  //       //       $rootScope.shouldUpload = true;
  //       //       // $scope.doRefresh();
  //       //       $.jStorage.set('taskpending', []);
  //       //     })}

  //       //  }

  //       console.log("app is in foreground", cordova.plugins.backgroundMode.isActive());
  //       if (cordova.plugins.backgroundMode.isActive()) {
  //         cordova.plugins.backgroundMode.enable();
  //         alert("app is in foreground", cordova.plugins.backgroundMode.isActive());
  //       } else {
  //         cordova.plugins.backgroundMode.disable();
  //         // cordova.plugins.backgroundMode.moveToBackground();
  //         alert("app is in background", cordova.plugins.backgroundMode.isActive());
  //       }
  //     }
  //   }
  // })

  //This service is to set flag to identify History and Task page
  .service('MyFlagValue', function () {
    var flag;
    this.setFlag = function (value) {
      flag = value;
    };

    this.getFlag = function () {
      return flag;
    }
  });
