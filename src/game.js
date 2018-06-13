import timer from './timer.js';
import gameUI from './gameUI.js';
import score from './score.js';
import gameRules from './gameRules.js';

export default function createGame(createQuestionsNavigator, client) {

    let theQuestionNavigator;
    let secondsPerQuestion = gameRules().secondsPerQuestion;
    let questionTimer = new timer(secondsPerQuestion, handlerEventTime);
    let gameScoreboard = new score();
    let ui = gameUI();

    function getQuestionNavigator() {
        return theQuestionNavigator;
    }

    function start() {
        ui.setInvisibleQuestions();
        ui.setInvisibleStatistics();
        ui.setOnStart(onStartGame);
        ui.setOnNextQuestion(onNextQuestion);
        client.getQuestions(function (questions) {
            theQuestionNavigator = createQuestionsNavigator(questions);
        });
    }

    function loadNextQuestion() {
        if (theQuestionNavigator.areThereNonVisitedQuestions()) {
            ui.renderQuestion(theQuestionNavigator.getNextQuestion());
            ui.setVisibleQuestions();
        }
        else {
            gameOver();
        }
    }

    function handlerEventTime(time) {
        ui.setClock(time);

        if (time <= 0) {
            onNextQuestion();
        }
    }

    function updateUIScoreboard() {
        ui.setScoreboard(gameScoreboard.getScore());
    }

    function onStartGame() {
        questionTimer.restart();
        theQuestionNavigator.restartQuestions();
        gameScoreboard.restart();

        ui.renderQuestion(theQuestionNavigator.getCurrentQuestion());
        ui.setVisibleQuestions();
        updateUIScoreboard();
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
        updateUIScoreboard();
        questionTimer.restart();
        loadNextQuestion();
    }

    function isAnswerCorrect(currentQuestion, selectedAnswer) {
        return currentQuestion.correctAnswer.id === parseInt(selectedAnswer.id);
    }

    function recalculateScoreIfSuccess(time) {
        if (time <= gameRules().maxTimeQuickReply) {
            gameScoreboard.increment(gameRules().pointsToAddQuickReplySuccess);
        } else if (time <= gameRules().maxTimeNormalReply) {
            gameScoreboard.increment(gameRules().pointsToAddNormalReplySuccess);
        } else {
            gameScoreboard.increment(gameRules().pointsToAddSlowReplySuccess);

        }
    }

    function recalculateScoreIfFails(time) {
        if (time <= gameRules().maxTimeQuickReply) {
            gameScoreboard.decrement(gameRules().pointsToSubtractQuickReplyFail);
        } else {
            gameScoreboard.decrement(gameRules().pointsToSubtractNormalReplyFail);

        }
    }

    function recalculateScoreIfDontAnswer() {
        gameScoreboard.decrement(gameRules().pointsToSubtractNoReply);
    }

    function gameOver() {
        ui.setInvisibleQuestions();
        questionTimer.stop();
        ui.setVisibleStart();
    }


    return {
        start,
        gameOver,
        getQuestionNavigator,
    }
};
