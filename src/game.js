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

    function updateUIScoreboard(){
        ui.setScoreboard(gameScoreboard.getScore());
    }

    function onStartGame() {
        questionTimer.restart();
        theQuestionNavigator.restartQuestions();
        ui.setVisibleQuestions();
        // loadNextQuestion();
        ui.renderQuestion(theQuestionNavigator.getCurrentQuestion());
        ui.setVisibleQuestions();
        updateUIScoreboard();
    }

    function getTimeElapsed(){
        return secondsPerQuestion - questionTimer.get();
    }

    function onNextQuestion() {
        let currentQuestion = theQuestionNavigator.getCurrentQuestion();
        // console.log("CURRENT QUESTION ONNEXTQUESTION-->",currentQuestion);
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
        // console.log("vvvv");
        updateUIScoreboard();
        questionTimer.restart();
        loadNextQuestion();
    }

    function isAnswerCorrect(currentQuestion, selectedAnswer) {
        // console.log("CURRENT QUESTION-->",currentQuestion);
        // console.log("SELETED ANSWER-->",selectedAnswer);
        return currentQuestion.correctAnswer.id === parseInt(selectedAnswer.id);
    }

    function recalculateScoreIfFails(time) {
        console.log("Fallo");
    }

    function recalculateScoreIfSuccess(time) {
        console.log("******TIME-->",time);
        if (time <= gameRules().maxTimeQuickReply) {
            console.log("******QUICK TIME-->",time);
            gameScoreboard.increment(gameRules().pointsQuickReply);
        } else if (time <= gameRules().maxTimeNormalReply){
            console.log("******NORMAL TIME-->",time);
            gameScoreboard.increment(gameRules().pointsNormalReply);
        } else {
            console.log("******SLOW TIME-->",time);
            gameScoreboard.increment(gameRules().pointsSlowReply);

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
