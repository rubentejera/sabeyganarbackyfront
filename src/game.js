import timer from './timer.js';
import gameUI from './gameUI.js';

export default function createGame(createQuestionsNavigator, client) {

   // let startButton;
    let questionsContainerUI;
    let questionTitleUI;
    let questionAnswersUI;
    let radioAnswersListUI;
    let theQuestionNavigator;
    let answerListUI;
    let secondsPerQuestion = 10;
    let questionTimer;
    let ui = gameUI();

    function getElementUI() {
        questionsContainerUI = document.querySelector('.questions__container');
       // startButton = document.querySelector('.start--button');
        // startButton.addEventListener('click', onStartGame);
        questionTitleUI = document.querySelector('.question--title');
        questionAnswersUI = document.querySelectorAll('.question--answer');
        radioAnswersListUI = document.querySelectorAll('.input-radio');
        answerListUI = document.getElementById('answer--list');
    }

    function start() {
        getElementUI();
        ui.setInvisibleComponent(questionsContainerUI);
        ui.setClickEventListener(ui.getElement().startButton,onStartGame);
        ui.setClickEventListener(ui.getElement().nextQuestionButton,onNextQuestion);
        client.getQuestions(function (questions) {
            theQuestionNavigator = createQuestionsNavigator(questions);
        });
    }

    function loadNextQuestion() {
        if (theQuestionNavigator.areThereNonVisitedQuestions()) {
            ui.renderQuestion(theQuestionNavigator.getNextQuestion());
        }
        else {
            gameOver();
        }
    }

    function handlerEventTime(time){
        ui.updateTimer(time);

        if (time <= 0) {
            onNextQuestion();
        }
    }

    questionTimer = new timer(secondsPerQuestion, handlerEventTime);



    function onStartGame() {
        questionTimer.restart();
        theQuestionNavigator.restartQuestions();
        loadNextQuestion();
        ui.setInvisibleComponent(ui.getElement().startButton);
    }

    function onNextQuestion() {
        questionTimer.restart();
        loadNextQuestion();
    }

    function gameOver() {
        ui.setInvisibleComponent(questionsContainerUI);
        questionTimer.stop();
        ui.setVisibleComponent(ui.getElement().startButton);
    }


    return {
        start,
        questionsNavigator: createQuestionsNavigator
    }
};
