// var adminurl = "http://wohlig.io/api/"; //local

// var adminurl = "http://192.168.2.28/api/"; //server 
// var adminurl = "https://secureabsolute.wohlig.co.in/api/"; //Test server
var adminurl = "http://absolutesurveyors.com/api/"; //server

// var imgpath = adminurl + "uploadfile/getupload?file=";
var imgurlForRead = adminurl + "upload/";
var imgurl = adminurl + "upload/index";
var imgpath = imgurlForRead + "readFile?file=";
// var uploadurl = imgurl;

var service = angular.module('starter.services', []);
