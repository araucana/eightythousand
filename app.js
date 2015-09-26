var app = angular.module('quizApp', []);

/*
app.controller('CountryCtrl', function ($scope, $http) {
   $http.get('https://80000hours.org/wp-json/career_profiles').success(function(data) {
       $scope.countries = data;
   });
5
});
*/

app.directive('quiz', function(quizFactory) {
    return {
        restrict: 'AE',
        scope: {},
        templateUrl: 'template.htm',
        link: function(scope, elem, attrs) {
            scope.reset = function() {
                scope.inProgress = false;
                scope.score = 0;
            }

            scope.getQuestion = function() {
                var q = quizFactory.getQuestion(scope.id);
                if(q) {
                    scope.question = q.question;
                    scope.options = q.options;
                    scope.answer = q.answer;
                    scope.answerMode = true;
                } else {
                    scope.quizOver = true;
                }
            };

            scope.checkAnswer = function() {
                if(!$('input[name=answer]:checked').length) return;

                var ans = $('input[name=answer]:checked').val();

                if(ans == scope.options[scope.answer]) {
                    scope.score++;
                    scope.correctAns = true;
                } else {
                    scope.correctAns = false;
                }

                scope.answerMode = false;
            };

            scope.nextQuestion = function() {
                scope.id++;
                scope.getQuestion();
            }

            scope.reset();
        }
    }
});


app.factory('quizFactory', function() {
    return [
        {
            question: "Are you good at math?",
            options: ["Yes", "No"],
        },
        {
            question: "Are you good at writing or speaking?",
            options: ["Yes", "No"],
        },
        {
            options: ["Yes", "No"],
            question: "Happy to work in most competitive fields?",
        },
        {
            question: "How uncertain are you about what you want to do in the future?",
            options: ["No", "A little", "A lot"],
        }
    ];
});

