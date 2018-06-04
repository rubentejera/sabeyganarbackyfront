import timer from './timer.js';
import gameUI from './gameUI.js';
import scoreboard from './scoreboard.js';
import gameRules from './gameRules.js';

export default function createGame(createQuestionsNavigator, client) {

    let theQuestionNavigator;
    let secondsPerQuestion = gameRules().secondsPerQuestion;
    // let questionTimer = new timer(secondsPerQuestion, handlerEventTime);
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

    function updateUIScoreboard(){
        ui.setScoreboard(gameScoreboard.getScore());
    }

    function onStartGame() {
        questionTimer.restart();
        theQuestionNavigator.restartQuestions();
        loadNextQuestion();
        ui.setInvisibleStart();
        updateUIScoreboard();
    }

    function getTimeElapsed(){
        return secondsPerQuestion - questionTimer.get();
    }

    function onNextQuestion() {
        let currentQuestion = theQuestionNavigator.getCurrentQuestion();
        let selectedAnswer = ui.getSelectedAnswer();
        let currentTimer = getTimeElapsed();
        if (selectedAnswer) {
            if (isAnswerCorrect(currentQuestion, selectedAnswer)) {
                recalculateScoreIfSuccess(currentTimer);
            } else {
                recalculateScoreIfFails(currentTimer);
            }
        } else {
            recalculateScoreIfDontAnswer(currentTimer);
        }

        updateUIScoreboard();
        questionTimer.restart();
        loadNextQuestion();
    }

    function isAnswerCorrect(currentQuestion, selectedAnswer) {
        return currentQuestion.correctAnswer.id === parseInt(selectedAnswer.id);
    }

    function recalculateScoreIfFails(time) {

    }

    function recalculateScoreIfSuccess(time) {
        // const maxTimeQuickReply = 3;
        // const maxTimeNormalReply = 10;
        //
        // const pointsQuickReply = 3;
        // const pointsNormalReply = 2;
        // const pointsSlowReply = 1;


        if (time <= gameRules().maxTimeQuickReply) {
            gameScoreboard.increment(gameRules().pointsQuickReply);
        } else if (time <= gameRules().maxTimeNormalReply){
            // console.log("******NORMAL TIME-->",time);
        } else {
            // console.log("******SLOW TIME-->",time);
        }

    }

    function recalculateScoreIfDontAnswer(time) {

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
