'use strict';
var app = angular.module('quizApp', []);

app.controller('QuizController', ['$scope', '$http', '$location', function ($scope, $http, $location) {

    var BUTTON_TEXT_INCOMPLETE = 'Quiz not yet completed';
    var BUTTON_TEXT_SUBMIT = 'Get results';
    var BUTTON_TEXT_RESUBMIT = 'Recalculate Results';

    // switches to BUTTON_TEXT_RESUBMIT after the first time calculateResults is
    // called
    var buttonNameSubmitText = BUTTON_TEXT_SUBMIT;
    // an array containing user-selected question choices
    var selectedChoices = {};

   $http.get('career_profiles.json').success(function(data) {
       $scope.allprofiles = data;
   });

   $scope.Math = window.Math;

   // a list of the top three results
   $scope.results = [];

   $scope.questions = {
        '1math' : {
            question: "Are you good at math?",
            options: {"Yes": 1, "No": -2},
            profileField: 'requiresQuantitativeSkills',
        },
        '2comm' : {
            question: "Are you good at writing or speaking?",
            profileField: 'requiresVerbalAndSocialSkills',
            options: {"Yes": 1, "No": -1.5 },
        },
        '3competitive' : {
            question: "Happy to work in most competitive fields?",
            options: {"Yes": 0, "No": 3 },
            profileField: 'easeOfCompetition',
        },
        '4uncertain' : {
            question: "How much flexibility would you want in the future?",
            options: {"Does not matter": 0, "A lot": 1, "At least some": 0.5},
            profileField: 'optionValue',
        }
   };


    // called when user ngChange or ngClicks on a quiz option. Often both events
    // trigger when a user chooses a quiz option but this is a hack to make
    // things work.
    $scope.radioSelected = function(qkey, value){        
        selectedChoices[qkey] = value;
        console.log(qkey +" "+value);
        checkIfQuizDone();
    }

    $scope.buttonName = BUTTON_TEXT_INCOMPLETE;
    var checkIfQuizDone = function() {
        for (var key in $scope.questions) {
            if(typeof selectedChoices[key] == 'undefined') {
                $scope.buttonName = BUTTON_TEXT_INCOMPLETE;
                return false;
            }
        }
        $scope.buttonName = buttonNameSubmitText;
        return true;
    }

    var sortedArray = function (arr) {
        return Object.keys(arr).sort(function(a,b){
            return arr[b] - arr[a]
        });
    }

    var calculateProfileScore = function(score, choiceValue, fieldValue) {
        if (choiceValue < 0) {
			return parseFloat(score) 
                + parseFloat(5 * -1 * choiceValue) 
                + parseFloat(choiceValue * fieldValue);
            }
		if (choiceValue > 0) {
			return parseFloat(score) 
                + parseFloat(choiceValue * fieldValue);
	    }
        return score;
    };


    $scope.calculateResults = function(apply) {
        if(typeof $scope.allprofiles == "undefined") {
            console.log('waiting for json to load');
            setTimeout($scope.calculateResults, apply, 250);
        } else {
            calculateResultsInternal(apply);
        }
    };

    var calculateResultsInternal = function(apply) {
        console.log('calculateResultsInternal called');
        if (!checkIfQuizDone()) {
            alert('quiz not complete');
            return;
        }
        $scope.quizOver=true; 
        buttonNameSubmitText = BUTTON_TEXT_RESUBMIT;
        $scope.buttonName = buttonNameSubmitText;

        var i = 0;
        var scores = {};
        var possiblescores = {};
        for (var i = 0; i< $scope.allprofiles.length; i++) {
            var profileFields = $scope.allprofiles[i].custom_fields;
            if (typeof profileFields.careerCapital != 'undefined') {
                var profileScore = profileFields.careerCapital * 1.75;
                var profilePossibleScore = 5 * 1.75;
                for (var qkey in $scope.questions) {
				    var profileFieldValue = profileFields[$scope.questions[qkey].profileField];
                    var selectedChoiceValue = $scope.questions[qkey].options[selectedChoices[qkey]];
				    if (typeof profileFieldValue == 'undefined') {
					    profileScore += -1000;
                        profilePossibleScore += -1000;
				    } else {
                        //var oldProfileScore = profileScore;
                        profileScore = calculateProfileScore(profileScore,
                                selectedChoiceValue,
                                profileFieldValue);
                        /*console.log(qkey + $scope.questions[qkey].profileField 
                                + " " + oldProfileScore 
                                + " " + selectedChoiceValue 
                                + " " + profileFieldValue 
                                + " =>" + profileScore); */
                        var idealFieldValue = selectedChoiceValue < 0 ? 1 : 5;
                        profilePossibleScore = calculateProfileScore(profilePossibleScore,
                                selectedChoiceValue,
                                idealFieldValue);
			        }
			    }
                //console.log($scope.allprofiles[i].title + " " + profileScore + " " + profilePossibleScore);
                scores[i] = profileScore;
                possiblescores[i] = profilePossibleScore;
            }
        } 
        var keysSorted = sortedArray(scores);
        $scope.results = [];
        for (var i = 0 ; i<3; i++) {
            var index = keysSorted[i];
            var profile = $scope.allprofiles[index];
            var row = {'profile': profile, 'match' : scores[index], 'matchPossible' : possiblescores[index]};
            $scope.results.push(row);
        }
        updateUrl();
        if (apply) {
            $scope.$apply();
        }
        console.log('calculateResultsInternal end');
    };

    var updateUrl = function() {
        var path = '';
        for (var qkey in $scope.questions) {
            path += qkey + '/'+ selectedChoices[qkey]+'/';
        }
        $location.path(path, false);
    }

    var loadUrl = function() {
        var args = $location.path().split('/');
        var parsedChoices = {};
        for (var i = 1; i< args.length - 1; i+=2) {
            parsedChoices[args[i]] = args[i+1];
        }
        if (!checkIfValidUrlAndShouldLoad(parsedChoices)) {
            return;
        }
        selectedChoices = parsedChoices;
        
        $scope.calculateResults(true);
    }

    $scope.isChecked = function(qkey, optionName) {
        return selectedChoices[qkey] == optionName;
    }
    
    var checkIfValidUrlAndShouldLoad = function(parsedChoices) {
        for (var qkey in $scope.questions) {
            if (Object.keys(parsedChoices).indexOf(qkey) == -1) {
                console.log("question <" + qkey + "> not in url <" + Object.keys(parsedChoices) + ">");
                return false;
            }
            if (Object.keys($scope.questions[qkey].options).indexOf(parsedChoices[qkey]) == -1) {
                console.log("question <" + qkey + "> option <" + parsedChoices[qkey] + "> not an option in <" + Object.keys($scope.questions[qkey].options) + ">");
                return false;
            }
        }
        return true;
    }

    loadUrl();
}]);

