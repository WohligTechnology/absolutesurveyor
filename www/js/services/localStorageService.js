service.service('LocalStorageService', function (MyServices) {

    // Local Storage Single Assignment fileObject
    // var assignmentFileObject = {
    //     name: "/home/dev/djkjks/odhljd.jpg",
    //     serverFile: "ksjaskjlakljslkas.jpg" || undefined,
    //     retry: 0
    // };
    // var assignment = {
    //     _id: "89732382782839"
    //     images: [assignmentFileObject],
    //     jir: [assignmentFileObject],
    //     document: [assignmentFileObject]
    // };

    var LocalStorageMain = this;

    //Function to Add document to local storage
    this.addToLocalStorage = function (assignment) {
        var localStorage = this.getLocalValues();
        localStorage.push(assignment);
        console.log("######### localStorage ############", localStorage);
        this.saveStorage(localStorage);
    };

    this.saveStorage = function (localStorages) {
        console.log("######### localStorage3 ############", localStorages);
        $.jStorage.set('localStorage', localStorages);
        console.log("######### localStorage2 ############", $.jStorage.get('localStorage'));
    };

    // Get Values for all Documents
    this.getLocalValues = function () {
        var localStorage = $.jStorage.get('localStorage');
        if (_.isEmpty(localStorage)) {
            localStorage = [];
        }
        return localStorage;
    };

    // Upload Files
    this.uploadFiles = function (callback) {
        var localStorage = this.getLocalValues();
        var assignment = _.first(localStorage);
        if (assignment) {
            var unUploadedImages = _.filter(assignment.images, function (n) {
                return !n.serverValue;
            });
            var unUploadedJir = _.filter(assignment.jir, function (n) {
                return !n.serverValue;
            });
            var unUploadedDocument = _.filter(assignment.document, function (n) {
                return !n.serverValue;
            });
            async.series({
                unUploadedImages: function (callback) {
                    if (unUploadedImages.length == 0) {
                        callback();
                    } else {
                        async.concatLimit(unUploadedImages, 1, function (data, callback) {
                            LocalStorageMain.uploadDocument(data, "images", callback)
                        }, callback);
                    }
                },
                unUploadedJir: function (callback) {
                    if (unUploadedJir.length == 0) {
                        callback()
                    } else {
                        async.eachSeries(unUploadedJir, function (data, callback) {
                            LocalStorageMain.uploadDocument(data, "jir" ,callback)
                            // console.log("data0",data);
                            // callback();
                        }, callback);
                    }
                },
                unUploadedDocument: function (callback) {
                    if (unUploadedDocument.length == 0) {
                        callback()
                    } else {
                        async.concatLimit(unUploadedDocument, 1, function (data, callback) {
                            LocalStorageMain.uploadDocument(data, "document", callback)
                        }, callback);
                    }
                },
                uploadToAssignment: function (callback) {
                    // Upload to uploadToAssignment maping and all
                    var localStorage = LocalStorageMain.getLocalValues();
                    var assignment = _.first(localStorage);
                    assignment.images = _.map(assignment.images, "serverValue");
                    assignment.jir = _.map(assignment.jir, "serverValue");
                    assignment.document = _.map(assignment.document, "serverValue");
                    // uploadAssignment now
                    // on Success first Element from jStorage
                    // Delete from JStorage
                    callback();
                }
            }, function (err, data) {
                if (err) {
                    callback(err);
                } else {
                    // this.uploadFiles(callback);
                }
            });
        } else {
            LocalStorageMain.uploadDocument({}, "jir" ,callback)
            console.log("No more assignment documents to upload");
        }
    };

    this.uploadDocument = function (fileObject, objectKey, callback) {
        // fileObject.name ==> Upload
        // fileObject.serverValue = values came from upload
        console.log("############## fileObject #############");
        MyServices.uploadDocument({file:"/home/wohlig/Documents/htdocs/absolutesurveyor/www/img/cover.jpg"},function(data){
             
            console.log("########### data ##############",data);
            callback(null,fileObject);
        })

        // var indexVal = _.findIndex(assignment[objectKey], function (n) {
        //     return fileObject.name == n.name;
        // });
        // localStorage[0][objectKey][indexVal].serverValue = fileObject.serverValue;
        // this.saveStorage(localStorage);
       
    };

    this.isItLocalStorageData = function (assignmentList) {
        var localStorage = this.getLocalValues();
        _.each(assignmentList, function (assignment) {
            var isThereInLocal = _.find(localStorage, function (n) {
                return assignment._id == n._id;
            });
            if (isThereInLocal) {
                assignment.onLocalStorage = true;
            }
        });
    };


})