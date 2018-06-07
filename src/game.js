import timer from './timer.js';
import gameUI from './gameUI.js';
import scoreboard from './scoreboard.js';
import gameRules from './gameRules.js';

export default function createGame(createQuestionsNavigator, client) {

    let theQuestionNavigator;
    let secondsPerQuestion = gameRules().secondsPerQuestion;
    let questionTimer = new timer(secondsPerQuestion, handlerEventTime);
    let gameScoreboard = new scoreboard();
    let ui = gameUI();

    function getQuestionNavigator() {
        return theQuestionNavigator;
    }

    function start() {
        ui.setInvisibleQuestions();
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
            console.log("TIEMPO ACABADO Y PASO A LA NEXT QUESTION");
            recalculateScoreIfDontAnswer();
            updateUIToNextQuestion();
        }

        // updateUIScoreboard();
        // questionTimer.restart();
        // loadNextQuestion();
    }

    function updateUIToNextQuestion(){
        updateUIScoreboard();
        questionTimer.restart();
        loadNextQuestion();
    }

    function isAnswerCorrect(currentQuestion, selectedAnswer) {
        return currentQuestion.correctAnswer.id === parseInt(selectedAnswer.id);
    }

    function recalculateScoreIfSuccess(time) {
        if (time <= gameRules().maxTimeQuickReply) {
            gameScoreboard.increment(gameRules().pointsQuickReplySuccess);
        } else if (time <= gameRules().maxTimeNormalReply) {
            gameScoreboard.increment(gameRules().pointsNormalReplySuccess);
        } else {
            gameScoreboard.increment(gameRules().pointsSlowReplySuccess);

        }
    }

    function recalculateScoreIfFails(time) {
        if (time <= gameRules().maxTimeQuickReply) {
            gameScoreboard.decrement(gameRules().pointsQuickReplyFail);
        } else {
            gameScoreboard.decrement(gameRules().pointsNormalReplyFail);

        }
    }

    function recalculateScoreIfDontAnswer() {
        gameScoreboard.decrement(gameRules().pointsNoReply);
    }

    function gameOver() {
        ui.setInvisibleQuestions();
        questionTimer.stop();
        ui.setVisibleStart();
    }


    return {
        start,
        getQuestionNavigator,
    }
};
