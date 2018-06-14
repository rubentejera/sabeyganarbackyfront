import timer from './timer.js';
import gameUI from './gameUI.js';
import score from './score.js';
import gameRules from './gameRules.js';

export default function createGame(createQuestionsNavigator, client) {

    let theQuestionNavigator;
    let secondsPerQuestion = gameRules().secondsPerQuestion;
    let questionTimer = new timer(secondsPerQuestion, handlerEventTime);
    let gameScore = new score();
    let ui = gameUI();

    function getQuestionNavigator() {
        return theQuestionNavigator;
    }

    function start() {
        ui.start(onStartGame, onNextQuestion);

        client.getQuestions(function (questions) {
            theQuestionNavigator = createQuestionsNavigator(questions);
        });
    }

    function loadNextQuestion() {
        if (theQuestionNavigator.areThereNonVisitedQuestions()) {
            ui.renderQuestion(theQuestionNavigator.getNextQuestion());

        } else {
            gameOver();
        }
    }

    function handlerEventTime(time) {
        ui.setClock(time);

        if (time <= 0) {
            onNextQuestion();
        }
    }

    function updateUIScore() {
        ui.setScore(gameScore.getScore());
    }

    function onStartGame() {
        ui.onStartGame(theQuestionNavigator.getCurrentQuestion());
        questionTimer.restart();
        theQuestionNavigator.restartQuestions();
        gameScore.restart();
        updateUIScore();
    }

    function getTimeElapsed() {
        return secondsPerQuestion - questionTimer.get();
    }

    function onNextQuestion() {
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

                updateUIToNextQuestion();

            } else {
                console.log("NO DEBERIA PODER ENTRAR AQUI SIN SELECCIONAR UNA OPCION");
            }

        } else {
            recalculateScoreIfDontAnswer();
            updateUIToNextQuestion();
        }

    }

    function updateUIToNextQuestion() {
        updateUIScore();
        questionTimer.restart();
        loadNextQuestion();
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

    function gameOver() {
        questionTimer.stop();
        start();
    }


    return {
        start,
        gameOver,
        getQuestionNavigator,
    }
};
