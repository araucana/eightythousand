'use strict';
var app = angular.module('quizApp', []);


app.controller('QuizController', function ($scope, $http) {
   $http.get('career_profiles.json').success(function(data) {
       $scope.allprofiles = data;
   });

   $scope.selectedChoices = {};
   $scope.results = [];

   $scope.questions = [
        {
            question: "Are you good at math?",
            options: {"Yes": 1, "No": -1},
            name:'math',
        },
        {
            question: "Are you good at writing or speaking?",
            options: {"Yes": 1, "No": -1 },
            name:'comm',
        },
        {
            options: {"Yes": -1, "No": 1 },
            question: "Happy to work in most competitive fields?",
            name:'competitive',
        },
        {
            question: "How certain are you about what you want to do in the future?",
            options: {"Very": -1, "Not at all":1, "Some": 0},
            name:'uncertain',
        }
    ];
    var incomplete = 'Quiz not yet completed';
    var finishquiz = 'Get results';
    $scope.buttonName = incomplete;

    $scope.radioSelected = function(questionName, value){        
        $scope.selectedChoices[questionName] = value;
        console.log(questionName +" "+value);
        $scope.checkIfQuizDone();
    }

    $scope.questionmap = [
				['math','requiresQuantitativeSkills'],
				['comm','requiresVerbalAndSocialSkills'],['competitive','easeOfCompetition'],['uncertain','optionValue']
				];

    $scope.checkIfQuizDone = function() {
		for (var j = 0; j<$scope.questionmap.length; j++) {
			var choiceskey = $scope.questionmap[j][0];
            if(typeof $scope.selectedChoices[choiceskey] == 'undefined') {
                $scope.buttonName = incomplete;
                return false;
            }
        }
        $scope.buttonName = finishquiz;
        return true;
    }

    $scope.calculateResults = function() {
        if (!$scope.checkIfQuizDone()) {
            alert('quiz not complete');
            return;
        }
        console.log('recalculating');
        $scope.quizOver=true; 
        finishquiz = 'Recalculate Results';
        $scope.buttonName = finishquiz;
        var i = 0;
        var scores = {};
        for (var i = 0; i< $scope.allprofiles.length; i++) {
            var profile = $scope.allprofiles[i];
            var fields = profile.custom_fields;
            var choices = $scope.selectedChoices;

			scores[i] = 0;
			for (var j = 0; j<$scope.questionmap.length; j++) {
                var choiceskey = $scope.questionmap[j][0];
				var fieldskey = $scope.questionmap[j][1];
				if (typeof fields[fieldskey] == 'undefined') {
					scores[i] += -1000;
				} else {
				    if (choices[choiceskey] < 0) {
					    scores[i] = parseFloat(scores[i]) + parseFloat(5) - parseFloat(fields[fieldskey]);
				    } else if (choices[choiceskey] > 0) {
					    scores[i] = parseFloat(scores[i]) + parseFloat(fields[fieldskey]);
				    }
			    }
			}
        } 
        var keysSorted = Object.keys(scores).sort(function(a,b){return scores[b]-scores[a]});
        $scope.results = [];
        for (var i = 0 ; i<3; i++) {
            var index = keysSorted[i];
            var profile = $scope.allprofiles[index];
            var row = {'profile': profile,'match':scores[index]}
            $scope.results.push(row)
        }
    };
});

