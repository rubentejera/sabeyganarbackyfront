import timer from './timer.js';
import gameUI from './gameUI.js';
import score from './score.js';
import scores from './scores.js';
import gameRules from './gameRules.js';

export default function createGame(createQuestionsNavigator, serverQuestions) {

    let theQuestionNavigator;
    let secondsPerQuestion = gameRules().secondsPerQuestion;
    let questionTimer = new timer(secondsPerQuestion, handlerEventTime);
    let gameScore = new score();
    let gameScores = new scores();
    let ui = gameUI(handlerEventOnStartGame, handlerEventOnNextQuestion, handlerEventOnEnterName);

    function getQuestionNavigator() {
        return theQuestionNavigator;
    }

    function init() {
        ui.initialState();

        serverQuestions.getQuestions(function (questions) {
            theQuestionNavigator = createQuestionsNavigator(questions);
        });
    }

    function handlerEventTime(time) {
        ui.setClock(time);

        if (time <= 0) {
            handlerEventOnNextQuestion();
        }
    }


    function handlerEventOnEnterName(name){//TODO Guardar Name y devolver array ordenado

        gameScores.addScore({name:name,score:gameScore.getScore()});


        let statisticsExample = [
            {
                name: "Maria",
                score: 13
            },
            {
                name: "Pepe",
                score: 10
            },
            {
                name: "Juan",
                score: 9
            }
        ];

        ui.gameOverState(gameScores.getScores(),statisticsExample);
    }

    function handlerEventOnStartGame() {
        theQuestionNavigator.restartQuestions();
        ui.startGameState(theQuestionNavigator.getCurrentQuestion());
        questionTimer.restart();
        gameScore.restart();
        updateUIScore();
    }

    function handlerEventOnNextQuestion() {
        let currentQuestion = theQuestionNavigator.getCurrentQuestion();
        let selectedAnswer = ui.getSelectedAnswer();
        let currentTimer = getTimeElapsed();

        if (questionTimer.get() !== 0) {
            if (selectedAnswer) {
                if (isAnswerCorrect(currentQuestion, selectedAnswer)) {
                    recalculateScoreIfSuccess(currentTimer);

                } else {
                    recalculateScoreIfFails(currentTimer);
                }

                goToNextQuestion();

            } else {
                console.log("NO DEBERIA PODER ENTRAR AQUI SIN SELECCIONAR UNA OPCION");
            }

        } else {
            recalculateScoreIfDontAnswer();
            goToNextQuestion();
        }

    }

    function updateUIScore() {
        ui.setScore(gameScore.getScore());
    }

    function getTimeElapsed() {
        return secondsPerQuestion - questionTimer.get();
    }


    function goToNextQuestion() {
        if (theQuestionNavigator.areThereNonVisitedQuestions()) {
            ui.nextQuestionState(theQuestionNavigator.getNextQuestion());
            updateUIScore();
            questionTimer.restart();

        } else {
            allQuestionsCompleted();
        }
    }

    function isAnswerCorrect(currentQuestion, selectedAnswer) {
        return currentQuestion.correctAnswer.id === parseInt(selectedAnswer.id);
    }


    function recalculateScoreIfSuccess(time) {
        if (time <= gameRules().maxTimeQuickReply) {
            gameScore.increment(gameRules().pointsToAddQuickReplySuccess);

        } else if (time <= gameRules().maxTimeNormalReply) {
            gameScore.increment(gameRules().pointsToAddNormalReplySuccess);

        } else {
            gameScore.increment(gameRules().pointsToAddSlowReplySuccess);
        }
    }

    function recalculateScoreIfFails(time) {
        if (time <= gameRules().maxTimeQuickReply) {
            gameScore.decrement(gameRules().pointsToSubtractQuickReplyFail);

        } else {
            gameScore.decrement(gameRules().pointsToSubtractNormalReplyFail);

        }
    }

    function recalculateScoreIfDontAnswer() {
        gameScore.decrement(gameRules().pointsToSubtractNoReply);
    }

    function allQuestionsCompleted() {
        questionTimer.stop();
        ui.allQuestionsCompletedState();
        // ui.finishState();
    }


    return {
        init,
        allQuestionsCompleted,//only for test??
        getQuestionNavigator,
    }
};
