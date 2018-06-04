import timer from './timer.js';
import gameUI from './gameUI.js';
import scoreboard from './scoreboard.js';

export default function createGame(createQuestionsNavigator, client) {

    let theQuestionNavigator;
    let secondsPerQuestion = 10;
    let questionTimer = new timer(secondsPerQuestion, handlerEventTime);
    let gameScoreboard = new scoreboard();
    let ui = gameUI();

    function getQuestionNavigator(){
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


    function onStartGame() {
        questionTimer.restart();
        theQuestionNavigator.restartQuestions();
        loadNextQuestion();
        ui.setInvisibleStart();
        ui.setScoreboard(gameScoreboard.getScore());
    }

    function onNextQuestion() {
        // checkUserAnswer();
        questionTimer.restart();
        loadNextQuestion();
    }

    // function checkUserAnswer(){
    //     if(ui.getCorrectAnswer() == ui.getSelectedAnswer()){
    //
    //     }else{
    //
    //     }
    // }


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
