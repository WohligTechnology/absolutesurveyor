service.service('PopupService', function ($ionicPopup, MyServices, $state, $ionicListDelegate) {

    var PopupService = this;

    //To get decline task details
    this.decline = function (surveyId, assignId) {
        var data = {};
        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<textarea placeholder="Reason" class="decline-input"></textarea>',
            title: 'Please submit the reason for decline the task',
            cssClass: 'declinepop',
            buttons: [{
                text: 'Cancel',
                onTap: function (e) {
                    $ionicListDelegate.closeOptionButtons();
                }
            }, {
                text: '<b>Submit</b>',
                type: 'button-positive',
                onTap: function (e) {
                    var val = $.trim($("textarea").val());
                    if (val != "") {
                        data.message = val;
                    }
                    if (!data.message) {
                        //don't allow the user to close unless he enters wifi password
                        e.preventDefault();
                    } else {
                        PopupService.declinetask(surveyId, assignId, data.message);

                    }
                }
            }]
        });

        myPopup.then(function (res) {
            console.log('Tapped!', res);
        });
    };

    //To decline task
    this.declinetask = function (surveyId, assignId, message) {
        var decline = {};
        decline.surveyId = surveyId;
        decline.assignId = assignId;
        decline.message = message;
        MyServices.Decline(decline, function (data) {
            if (data.value) {
                $state.reload();
            }
        });
    };

    //To show task information
    this.openModal = function (value, url, controller) {
        this.assignmentObj = value;
        this.infoPopup = $ionicPopup.show({
            templateUrl: url
        });
        var currentPopup = this.infoPopup;
        var htmlEl = angular.element(document.querySelector('html'));
        htmlEl.on('click', function (event) {
            if (event.target.nodeName === 'HTML') {
                if (currentPopup) {
                    currentPopup.close();
                }
            }
        });
    };
})
