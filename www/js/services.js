// var adminurl = "http://wohlig.io/api/"; //local

// var adminurl = "http://192.168.1.121/api/"; //server 
// var adminurl = "https://test.absolutesurveyors.com/api/"; //Test server
var adminurl = "https://api.absolutesurveyors.com/api/"; //server
var uploadurl = "https://uploads.absolutesurveyors.com/api/"; //server
// var imgpath = adminurl + "uploadfile/getupload?file=";
var imgurlForRead = uploadurl + "upload/";
var imgurl = uploadurl + "upload/index";
var imgpath = imgurlForRead + "readFile?file=";

var service = angular.module('starter.services', []);
