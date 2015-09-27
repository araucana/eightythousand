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
            options: {"Yes": 1, "No":-1},
            question: "Happy to work in most competitive fields?",
            name:'competitive',
        },
        {
            question: "How certain are you about what you want to do in the future?",
            options: {"Very": -1, "Not at all":1, "Some": 0},
            name:'uncertain',
        }
    ];
    $scope.buttonName = 'Calculate Results';

    $scope.radioSelected = function(questionName, value){        
        $scope.selectedChoices[questionName] = value;
        console.log(questionName + value);
    }

    $scope.calculateResults = function() {
       $scope.quizOver=true; 
       $scope.buttonName = 'Recalculate Results';
        var i = 0;
        var scores = {};
        for (var i = 0; i< $scope.allprofiles.length; i++) {
            var profile = $scope.allprofiles[i];
            var fields = profile.custom_fields;
            var choices = $scope.selectedChoices;
            if (typeof fields['requiresQuantitativeSkills'] !== 'undefined' &&
                    typeof fields['requiresVerbalAndSocialSkills'] !== 'undefined' &&
                    typeof fields['easeOfCompetition'] !== 'undefined' &&
                    typeof fields['optionValue'] !== 'undefined'
                    ) {
                scores[i] = choices['math'] * fields['requiresQuantitativeSkills'] + 
                choices['comm'] * fields['requiresVerbalAndSocialSkills'] +
                choices['competitive'] * fields['easeOfCompetition'] + choices['uncertain'] * fields['optionValue'];
                console.log(profile.title + scores[i]);
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

