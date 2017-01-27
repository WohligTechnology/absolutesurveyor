// var adminurl = "http://192.168.0.137:80/api/"; //local

var adminurl = "http://104.155.238.145:80/api/"; //server

// var imgpath = adminurl + "uploadfile/getupload?file=";
var imgurl = adminurl + "upload/";
var imgpath = imgurl + "readFile?file=";
// var uploadurl = imgurl;

angular.module('starter.services', [])
.factory('MyServices', function ($http) {
  return {
    Login: function (email,callback) {
        $http({
          url: adminurl + 'Employee/getLoginSurveyor',
          method: 'POST',
          withCredentials: true,
          data: email
        }).success(callback);
      },
    Task: function (id,callback) {
      console.log(id);
      var data ={
        id : id
      };
        $http({
          url: adminurl + 'Assignment/tasklist',
          method: 'POST',
          withCredentials: true,
          data: data
        }).success(callback);
      },

    Decline: function (data,callback) {

        $http({
          url: adminurl + 'Assignment/decline',
          method: 'POST',
          withCredentials: true,
          data: data
        }).success(callback);
      },
    mobileSubmit: function (data,callback) {

        $http({
          url: adminurl + 'Assignment/mobileSubmit',
          method: 'POST',
          withCredentials: true,
          data: data
        }).success(callback);
      }

    }
});
