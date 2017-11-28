connector.controller('MarineSurveyCtrl', function ($scope, $timeout, MyFlagValue, $ionicPlatform, $state) {

    $scope.questionObj = {
        question: "Where are you? At destination?",
        questionNumber: 1,
        answer: "",
        type: "radio"
    }
    $scope.finalArray = [];
    $scope.isText = false;
    $scope.multiOption = false;
    $scope.isSubmit = false;
    $scope.isNumeric = false;
    $scope.lr, $scope.delievered, $scope.wet, $scope.damaged = null;
    $scope.short = null;

    //To hide refresh button
    angular.element(document.getElementsByClassName("right-btn")).css('display', 'none');

    //Function to save answer
    $scope.saveAnswer = function (value1, value2) {
        var obj = {};
        if (value2 == "Yes" || value2 == "No" || value2 == "Wet" || value2 == "Unloaded" || value2 == "Containerised" || value2 == "Holes" || value2 == "Partially Unloaded" || value2 == "Not Unloaded" || value2 == "Welding" || value2 == "Door Caps" || value2 == "Others" || value2 == "Open Vehicle" || value2 == "Good" || value2 == "Average" || value2 == "Bad" || value2 == "Short" || value2 == "Damage") {
            obj = {
                question: value1,
                answer: value2,
                no: $scope.questionObj.questionNumber,
                type: "radio"
            };
            var no = $scope.questionObj.questionNumber;
            // $scope.questionObj = {};
            $scope.finalArray.push(obj);
            console.log("$scope.finalArray", $scope.finalArray);
            $timeout(function () {
                $scope.getQuestion(no, value2);
            }, 100)
        } else {
            obj = {
                question: value1,
                answer: value2,
                no: $scope.questionObj.questionNumber,
                type: "text"
            };
            var no = $scope.questionObj.questionNumber;
            // $scope.questionObj = {};
            $scope.finalArray.push(obj);
            console.log("$scope.finalArray", $scope.finalArray);
            $timeout(function () {
                $scope.getQuestion(no, "text");
            }, 100)
        }
    };

    //To get question
    $scope.getQuestion = function (no, ans) {

        var demo = no + "-" + ans;
        switch (demo) {
            case "1-Yes":
                $scope.questionObj = {
                    question: "Is destination same as LR?",
                    questionNumber: 2
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isSubmit = false;
                $scope.isNumeric = false;
                break;
            case "2-Yes":
                $scope.questionObj = {
                    question: "Is it Full Truck Load?",
                    questionNumber: 3
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isSubmit = false;
                $scope.isNumeric = false;
                break;
            case "3-Yes":
                $scope.questionObj = {
                    question: "Was Vehicle involved in an accident?",
                    questionNumber: 4
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isSubmit = false;
                $scope.isNumeric = false;
                break;
            case "4-Yes":
                $scope.questionObj = {
                    question: "Is RC book available?",
                    questionNumber: 5
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isSubmit = false;
                $scope.isNumeric = false;
                break;

            case "5-Yes":
                $scope.questionObj = {
                    question: "",
                    questionNumber: 59
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isSubmit = false;
                $scope.isNumeric = true;
                $scope.getNumericOption($scope.questionObj.questionNumber);
                break;

            case "5-No":
                $scope.getQuestion(5, "text");
                break;

            case "59-text":
                $scope.getQuestion(5, "text");
                break;

            case "5-text":
                $scope.questionObj = {
                    question: "Number of packages in 1.LR 2.Delievered 3.Short 4.Wet 5.Damaged?",
                    questionNumber: 6
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isNumeric = true;
                $scope.isSubmit = false;
                $scope.getNumericOption($scope.questionObj.questionNumber);
                break;

            case "6-text":
                $scope.questionObj = {
                    question: "Is Packing shown to you?",
                    questionNumber: 7
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isSubmit = false;
                $scope.isNumeric = false;
                break;

            case "7-Yes":
                $scope.questionObj = {
                    question: "Is packing new?",
                    questionNumber: 8
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isSubmit = false;
                $scope.isNumeric = false;
                break;

            case "8-Yes":
                $scope.questionObj = {
                    question: "Is it Customary?",
                    questionNumber: 9
                }
                $scope.isText = false;
                $scope.isNumeric = false;
                $scope.multiOption = false;
                $scope.isSubmit = false;
                break;

            case "9-Yes":
                $scope.questionObj = {
                    question: "What was the condition of packing at time of survey?",
                    questionNumber: 10
                }
                $scope.isText = true;
                $scope.isNumeric = false;
                $scope.multiOption = false;
                $scope.isSubmit = false;
                break;

            case "10-text":
                // $scope.questionObj = {
                //   question: "Options",
                //   questionNumber: 11
                // }
                $scope.isText = false;
                $scope.isSubmit = false;
                $scope.isNumeric = false;
                $scope.getMultipleOption(11);
                break;

            case "11-Wet":
                $scope.questionObj = {
                    question: "Is Truck present during survey?",
                    questionNumber: 12
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isSubmit = false;
                $scope.isNumeric = false;
                break;

            case "12-Yes":
                $scope.questionObj = {
                    question: "Is it Containerised or is it an Open vehicle?",
                    questionNumber: 13
                }
                $scope.isText = false;
                $scope.isSubmit = false;
                $scope.isNumeric = false;
                $scope.getMultipleOption($scope.questionObj.questionNumber);
                break;

            case "13-Unloaded":
                $scope.questionObj = {
                    question: "Options",
                    questionNumber: 14
                }
                $scope.isText = false;
                $scope.isSubmit = false;
                $scope.isNumeric = false;
                $scope.getMultipleOption($scope.questionObj.questionNumber);
                break;

            case "14-Containerised":
                $scope.questionObj = {
                    question: "Was the light test done?",
                    questionNumber: 15
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isNumeric = false;
                $scope.isSubmit = false;
                break;

            case "15-Yes":
                $scope.questionObj = {
                    question: "Were there?",
                    questionNumber: 16
                }
                $scope.isText = false;
                $scope.isNumeric = false;
                $scope.isSubmit = false;
                $scope.getMultipleOption($scope.questionObj.questionNumber);
                break;

            case "16-Holes":
                $scope.questionObj = {
                    question: "Was there Tarpaulin on the floor of the truck as well?",
                    questionNumber: 17
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isNumeric = false;
                $scope.isSubmit = false;
                break;

            case "16-Welding":
                $scope.questionObj = {
                    question: "Was there Tarpaulin on the floor of the truck as well?",
                    questionNumber: 17
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isSubmit = false;
                break;

            case "16-Door Caps":
                $scope.questionObj = {
                    question: "Was there Tarpaulin on the floor of the truck as well?",
                    questionNumber: 17
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isSubmit = false;
                $scope.isNumeric = false;
                break;

            case "16-Others":
                $scope.questionObj = {
                    question: "Was there Tarpaulin on the floor of the truck as well?",
                    questionNumber: 17
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isSubmit = false;
                $scope.isNumeric = false;
                break;

            case "17-Yes":
                $scope.questionObj = {
                    question: "Are there any test reports available?",
                    questionNumber: 18
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isSubmit = false;
                $scope.isNumeric = false;
                break;

            case "18-Yes":
                $scope.questionObj = {
                    question: "Can it be repaired?",
                    questionNumber: 19
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isSubmit = false;
                $scope.isNumeric = false;
                break;

            case "19-Yes":
                $scope.questionObj = {
                    question: "How much is the estimated cost?",
                    questionNumber: 20
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isNumeric = true;
                $scope.isSubmit = true;
                $scope.getNumericOption($scope.questionObj.questionNumber);
                break;

            // case "20-text":
            //   $scope.questionObj = {
            //     question: "Estimated Costing",
            //     questionNumber: 20
            //   }
            //   $scope.isText = true;
            //   $scope.multiOption = false;
            //   $scope.isSubmit = true;
            //   break;

            case "1-No":
                $scope.questionObj = {
                    question: "Are you at spot of loss?",
                    questionNumber: 21
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isNumeric = false;
                $scope.isSubmit = false;
                break;

            case "21-Yes":
                $scope.getQuestion(2, "Yes");
                break;

            case "21-No":
                $scope.questionObj = {
                    question: "Where are you and Why are you here?",
                    questionNumber: 22
                }
                $scope.isText = true;
                $scope.multiOption = false;
                $scope.isSubmit = false;
                $scope.isNumeric = false;
                break;

            case "22-text":
                $scope.getQuestion(2, "Yes");
                break;

            case "2-No":
                $scope.getQuestion(21, "No");
                break;

            case "23-text":
                $scope.getQuestion(2, "Yes");
                break;

            case "4-No":
                $scope.questionObj = {
                    question: "Was there a transhipment during the journey?",
                    questionNumber: 24
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isNumeric = false;
                $scope.isSubmit = false;
                break;

            case "24-No":
                $scope.getQuestion(5, "text");
                break;

            case "24-Yes":
                $scope.questionObj = {
                    question: "Where and Why did the transhipment happen?",
                    questionNumber: 25
                }
                $scope.isText = true;
                $scope.multiOption = false;
                $scope.isNumeric = false;
                $scope.isSubmit = false;
                break;

            case "25-text":
                $scope.getQuestion(5, "text");
                break;

            case "7-No":
                $scope.questionObj = {
                    question: "Why is packing not shown?",
                    questionNumber: 26
                }
                $scope.isText = true;
                $scope.isNumeric = false;
                $scope.multiOption = false;
                $scope.isSubmit = false;
                break;

            case "26-text":
                $scope.getQuestion(10, "text");
                break;

            case "8-No":
                $scope.getQuestion(8, "Yes");
                break;

            case "9-No":
                $scope.questionObj = {
                    question: "Is it Adequate?",
                    questionNumber: 27
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isSubmit = false;
                $scope.isNumeric = false;
                break;

            case "27-No":
                $scope.questionObj = {
                    question: "Why is it adequate or inadequate?",
                    questionNumber: 28
                }
                $scope.isText = true;
                $scope.multiOption = false;
                $scope.isSubmit = false;
                $scope.isNumeric = false;
                break;

            case "27-Yes":
                $scope.getQuestion(27, "No");
                break;

            case "28-text":
                $scope.getQuestion(9, "Yes");
                break;

            case "13-Partially Unloaded":
                $scope.questionObj = {
                    question: "Options",
                    questionNumber: 14
                }
                $scope.isText = false;
                $scope.isSubmit = false;
                $scope.isNumeric = false;
                $scope.getMultipleOption($scope.questionObj.questionNumber);
                break;

            case "13-Not Unloaded":
                $scope.questionObj = {
                    question: "Options",
                    questionNumber: 14
                }
                $scope.isText = false;
                $scope.isSubmit = false;
                $scope.isNumeric = false;
                $scope.getMultipleOption($scope.questionObj.questionNumber);
                break;

            case "15-No":
                $scope.questionObj = {
                    question: "Options",
                    questionNumber: 16
                }
                $scope.isText = false;
                $scope.isSubmit = false;
                $scope.isNumeric = false;
                $scope.getMultipleOption($scope.questionObj.questionNumber);
                break;

            case "12-No":
                $scope.questionObj = {
                    question: "Ask for Photos,if any?",
                    questionNumber: 29
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isSubmit = false;
                $scope.isNumeric = false;
                break;

            case "29-text":
                $scope.getQuestion(15, "Yes");
                break;

            case "17-No":
                $scope.questionObj = {
                    question: "Test Reports, if any",
                    questionNumber: 18
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isSubmit = false;
                $scope.isNumeric = false;

                break;

            case "3-No":
                $scope.getQuestion(5, "text");
                break;

            case "14-Open Vehicle":
                $scope.questionObj = {
                    question: "Was there a Tarpaulin or not?",
                    questionNumber: 30
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isSubmit = false;
                $scope.isNumeric = false;
                break;

            case "30-No":
                $scope.questionObj = {
                    question: "What is the condition of truck floor?",
                    questionNumber: 31
                }
                $scope.isText = false;
                $scope.isSubmit = false;
                $scope.isNumeric = false;
                $scope.getMultipleOption($scope.questionObj.questionNumber);
                break;

            case "30-Yes":
                $scope.questionObj = {
                    question: "How many Tarpaulin were there?",
                    questionNumber: 32
                }
                $scope.isText = false;
                $scope.isNumeric = true;
                $scope.multiOption = false;
                $scope.isSubmit = false;
                break;

            // case "30-Yes":
            //   $scope.questionObj = {
            //     question: "# Tarpaulin",
            //     questionNumber: 32
            //   }
            //   $scope.isText = true;
            //   $scope.multiOption = false;
            //   $scope.isSubmit = false;
            //   break;

            case "32-text":
                $scope.questionObj = {
                    question: "Was Tarpaulin removed in your presence?",
                    questionNumber: 33
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isNumeric = false;
                $scope.isSubmit = false;
                break;

            case "33-Yes":
                $scope.questionObj = {
                    question: "Did you spread the Tarpaulin and check for quality?",
                    questionNumber: 34
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isNumeric = false;
                $scope.isSubmit = false;
                break;

            case "33-No":
                $scope.getQuestion(33, "Yes");
                break;

            case "34-No":
                $scope.getQuestion(30, "No");
                break;

            case "34-Yes":
                $scope.questionObj = {
                    question: "Were there any Holes in Tarpaulin?",
                    questionNumber: 35
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isNumeric = false;
                $scope.isSubmit = false;
                break;

            case "35-Yes":
                $scope.questionObj = {
                    question: "Was there Tarpaulin on the floor of the truck as well?",
                    questionNumber: 36
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isNumeric = false;
                $scope.isSubmit = false;
                break;

            case "35-No":
                $scope.getQuestion(35, "Yes");
                break;

            case "36-No":
                $scope.getQuestion(30, "No");
                break;

            case "36-Yes":
                $scope.getQuestion(30, "No");
                break;

            case "31-Good":
                // $scope.questionObj = {
                //   question: "Tarpaulin Floor",
                //   questionNumber: 37
                // }
                // $scope.isText = true;
                // $scope.multiOption = false;
                // $scope.isSubmit = false;
                $scope.getQuestion(60, "text");
                break;

            case "31-Average":
                $scope.getQuestion(60, "text");
                break;

            case "31-Bad":
                $scope.getQuestion(60, "text");
                break;

            case "37-text":
                $scope.getQuestion(17, "No");
                break;

            case "11-Short":
                $scope.questionObj = {
                    question: "Is Truck present during survey?",
                    questionNumber: 38
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isNumeric = false;
                $scope.isSubmit = false;
                break;

            case "38-Yes":
                $scope.questionObj = {
                    question: "Is there enough space for missing packages?",
                    questionNumber: 39
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isSubmit = false;
                $scope.isNumeric = false;
                break;

            case "38-No":
                $scope.getQuestion(39, "Yes");
                break;

            case "39-Yes":
                $scope.questionObj = {
                    question: "Are units missing from packages?",
                    questionNumber: 40
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isSubmit = false;
                $scope.isNumeric = false;
                break;

            case "39-No":
                $scope.getQuestion(44, "text");
                break;

            case "40-Yes":
                $scope.questionObj = {
                    question: "How many units are missing?",
                    questionNumber: 41
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isSubmit = false;
                $scope.isNumeric = true;
                break;

            case "40-No":
                $scope.getQuestion(44, "text");
                break;

            case "41-text":
                $scope.questionObj = {
                    question: "Was there enough space for missing packages?",
                    questionNumber: 42
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isSubmit = false;
                $scope.isNumeric = false;
                break;

            case "42-Yes":
                $scope.questionObj = {
                    question: "Was the package tampered?",
                    questionNumber: 43
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isNumeric = false;
                $scope.isSubmit = false;
                break;

            case "42-No":
                $scope.getQuestion(44, "text");
                break;

            case "43-Yes":
                $scope.questionObj = {
                    question: "How was the package tampered?",
                    questionNumber: 44
                }
                $scope.isText = true;
                $scope.multiOption = false;
                $scope.isSubmit = false;
                $scope.isNumeric = false;
                break;

            case "43-No":
                $scope.getQuestion(44, "text");
                break;

            case "44-text":
                $scope.questionObj = {
                    question: "Collect GRN",
                    questionNumber: 45
                }
                $scope.isText = true;
                $scope.multiOption = false;
                $scope.isNumeric = false;
                $scope.isSubmit = false;

                break;

            case "45-text":
                // $scope.questionObj = {
                //   question: "Documentation invoice/packing list/Endorsed LR",
                //   questionNumber: 46
                // }
                // $scope.isText = true;
                // $scope.multiOption = false;
                // $scope.isSubmit = true;
                // $scope.isNumeric = false;

                if ($scope.damaged != 0 && $scope.damaged != null && $scope.damaged != "") {
                    $scope.getQuestion(11, "Damage");
                } else {
                    $scope.getQuestion(17, "Yes");
                }

                break;

            case "11-Damage":
                $scope.questionObj = {
                    question: "Did damage happen during Unloading?",
                    questionNumber: 47
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isSubmit = false;
                $scope.isNumeric = false;
                break;

            case "47-Yes":
                $scope.questionObj = {
                    question: "How did damage happen during Unloading?",
                    questionNumber: 48
                }
                $scope.isText = true;
                $scope.multiOption = false;
                $scope.isSubmit = false;
                $scope.isNumeric = false;
                break;

            case "48-text":
                $scope.getQuestion(17, "No");
                break;

            case "47-No":
                $scope.questionObj = {
                    question: "Is it beacuse of Jerks and Jolts?",
                    questionNumber: 49
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isNumeric = false;
                $scope.isSubmit = false;
                break;

            case "49-Yes":
                $scope.questionObj = {
                    question: "Can Jerks and Jolts cause such magnitude of damage?",
                    questionNumber: 50
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isNumeric = false;
                $scope.isSubmit = false;
                break;

            case "49-No":
                $scope.getQuestion(17, "No");
                break;

            case "50-Yes":
                $scope.getQuestion(17, "No");
                break;

            case "50-No":
                $scope.getQuestion(17, "No");
                break;

            case "19-No":
                $scope.questionObj = {
                    question: "Can it be reprocessed?",
                    questionNumber: 51
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isSubmit = false;
                $scope.isNumeric = false;
                break;

            case "51-No":
                $scope.questionObj = {
                    question: "Can it be reconditioned?",
                    questionNumber: 52
                }
                $scope.isText = false;
                $scope.isNumeric = false;
                $scope.multiOption = false;
                $scope.isSubmit = false;
                break;

            case "52-No":
                $scope.questionObj = {
                    question: "Can it be cannibalised?",
                    questionNumber: 53
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isNumeric = false;
                $scope.isSubmit = false;
                break;

            case "53-No":
                $scope.questionObj = {
                    question: "Is it to be destroy?",
                    questionNumber: 54
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isSubmit = false;
                $scope.isNumeric = false;
                break;

            case "54-Yes":
                $scope.questionObj = {
                    question: "Does it have Residual value",
                    questionNumber: 55
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isSubmit = false;
                $scope.isNumeric = false;
                break;

            case "54-No":
                $scope.questionObj = {
                    question: "Input salvage value",
                    questionNumber: 56
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isSubmit = false;
                $scope.isNumeric = true;
                $scope.getNumericOption($scope.questionObj.questionNumber);
                break;

            case "55-No":
                $scope.getQuestion(45, "text");
                break;

            case "55-Yes":
                $scope.getQuestion(54, "No");
                break;

            case "53-Yes":
                $scope.getQuestion(19, "Yes");
                break;

            case "52-Yes":
                $scope.getQuestion(19, "Yes");
                break;

            case "51-Yes":
                $scope.getQuestion(19, "Yes");
                break;

            case "56-text":
                $scope.questionObj = {
                    question: "Can it be retained?",
                    questionNumber: 57
                }
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isSubmit = false;
                $scope.isNumeric = false;
                break;

            case "57-Yes":
                $scope.getQuestion(45, "text");
                break;

            case "57-No":
                $scope.questionObj = {
                    question: "Dispose salvage",
                    questionNumber: 58
                }
                $scope.isText = true;
                $scope.multiOption = false;
                $scope.isSubmit = false;
                $scope.isNumeric = false;
                break;

            case "58-text":
                $scope.getQuestion(45, "text");
                break;

            case "60-text":
                $scope.questionObj = {
                    question: "Possible source of ingress",
                    questionNumber: 61
                }
                $scope.isText = true;
                $scope.multiOption = false;
                $scope.isSubmit = false;
                $scope.isNumeric = false;

                break;

            case "61-text":
                if ($scope.short != 0 && $scope.short != null && $scope.short != "") {
                    $scope.getQuestion(11, "Short");
                } else if ($scope.damaged != 0 && $scope.damaged != null && $scope.damaged != "") {
                    $scope.getQuestion(11, "Damage");
                } else {
                    $scope.getQuestion(17, "Yes");
                }
                break;

            default: console.log("Invalid choice");
        }
    };

    //To get last question
    $scope.back = function () {
        console.log("$scope.finalArray2", $scope.finalArray);
        $scope.isSubmit = false;
        if ($scope.finalArray[$scope.finalArray.length - 1] != undefined) {
            $scope.questionObj = {
                question: $scope.finalArray[$scope.finalArray.length - 1].question,
                questionNumber: $scope.finalArray[$scope.finalArray.length - 1].no,
                answer: $scope.finalArray[$scope.finalArray.length - 1].answer
            }
            if ($scope.finalArray[$scope.finalArray.length - 1].type == "radio") {
                $scope.isText = false;
            } else if ($scope.finalArray[$scope.finalArray.length - 1].type == "text") {
                if ($scope.questionObj.questionNumber == 29) {
                    $scope.isText = false;
                } else {
                    $scope.isText = true;
                }
            };

            if ($scope.questionObj.questionNumber == 16 || $scope.questionObj.questionNumber == 14 || $scope.questionObj.questionNumber == 13 || $scope.questionObj.questionNumber == 11 || $scope.questionObj.questionNumber == 31) {
                $scope.getMultipleOption($scope.questionObj.questionNumber);
            } else {
                $scope.multiOption = false;
            }

            if ($scope.questionObj.questionNumber == 59 || $scope.questionObj.questionNumber == 6 || $scope.questionObj.questionNumber == 41 || $scope.questionObj.questionNumber == 32) {
                $scope.isText = false;
                $scope.multiOption = false;
                $scope.isNumeric = true;
                $scope.getNumericOption($scope.questionObj.questionNumber);
            } else {
                $scope.isNumeric = false;
            }

            $scope.finalArray.pop();
        }
    };

    //Final submit
    $scope.submit = function () {
        // alert("Submit called");
        $state.go('app.photos-documents');
    }

    //Function to get multiple options(more than two)
    $scope.getMultipleOption = function (qno) {
        $scope.multiArray = [];
        switch (qno) {
            case 11:
                // $scope.multiArray = ["Wet", "Short", "Damage"];
                if ($scope.wet != 0 && $scope.wet != null && $scope.wet != "") {
                    $scope.surveyWet = true;
                    $scope.surveyShort = false;
                    $scope.surveyDamaged = false;
                    $scope.getQuestion(11, "Wet");
                } else if ($scope.short != 0 && $scope.short != null && $scope.short != "") {
                    $scope.surveyWet = false;
                    $scope.surveyShort = true;
                    $scope.surveyDamaged = false;
                    $scope.getQuestion(11, "Short");
                } else if ($scope.damaged != 0 && $scope.damaged != null && $scope.damaged != "") {
                    $scope.surveyWet = false;
                    $scope.surveyShort = false;
                    $scope.surveyDamaged = true;
                    $scope.getQuestion(11, "Damage");
                }
                // $scope.multiOption = true;
                break;

            case 13:
                $scope.multiArray = ["Unloaded", "Partially Unloaded", "Not Unloaded"];
                $scope.multiOption = true;
                break;

            case 14:
                $scope.multiArray = ["Containerised", "Open Vehicle"];
                $scope.multiOption = true;
                break;

            case 16:
                $scope.multiArray = ["Holes", "Welding", "Door Caps", "Others"];
                $scope.multiOption = true;
                break;

            case 31:
                $scope.multiArray = ["Good", "Average", "Bad"];
                $scope.multiOption = true;
                break;

            default: console.log("Invalid choice");
        }
    };

    //To calculate short in question no 6
    $scope.calculateShort = function (val, index) {
        if ($scope.questionObj.questionNumber == 6) {

            if (index == 0) {
                $scope.lr = val;
            }
            if (index == 1) {
                $scope.delievered = val;
            }

            if ($scope.lr != null && $scope.delievered != null) {
                console.log("lr, delievered", $scope.lr, $scope.delievered);
                $scope.short = $scope.lr - $scope.delievered;
            } else {
                $scope.short = null;
            }

            if (index == 3) {
                $scope.wet = val;
            }

            if (index == 4) {
                $scope.damaged = val;
            }

            console.log("lr, delievered", $scope.lr, $scope.delievered, $scope.wet, $scope.damaged);

        }
    };

    //Function to get numeric values
    $scope.getNumericOption = function (qno) {
        $scope.numericInputArray = [];
        $scope.numericValue = [];
        switch (qno) {
            case 59:
                $scope.numericInputArray = ["GVW", "RLW", "VLW"];
                break;

            case 6:
                $scope.numericInputArray = ["LR", "Delievered", "Short", "Wet", "Damaged"];
                $scope.numericValue[0] = $scope.lr;
                $scope.numericValue[1] = $scope.delievered;
                $scope.numericValue[2] = $scope.short;
                $scope.numericValue[3] = $scope.wet;
                $scope.numericValue[4] = $scope.damaged;
                break;

            case 20:
                $scope.numericInputArray = ["Amt. in inr", "In %"];
                $scope.numericValue[0] = $scope.amt;
                $scope.numericValue[1] = $scope.percentage;

            case 56:
                $scope.numericInputArray = ["Amt. in inr", "In %"];
                $scope.numericValue[0] = $scope.amt;
                $scope.numericValue[1] = $scope.percentage;

            default: console.log("Invalid choice");
        }
    }

})