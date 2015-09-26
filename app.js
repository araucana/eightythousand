var app = angular.module('quizApp', []);

app.directive('quiz', function(quizFactory) {
    return {
        restrict: 'AE',
        scope: {},
        templateUrl: 'template.html',
        link: function(scope, elem, attrs) {
            scope.start = function() {
                scope.id = 0;
                scope.quizOver = false;
                scope.inProgress = true;
                scope.getQuestion();
            };

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
    var questions = [
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
 
    return {
        getQuestion: function(id) {
            if(id < questions.length) {
                return questions[id];
            } else {
                return false;
            }
        }
    };
});

