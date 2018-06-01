import timer from './timer.js';
import gameUI from './gameUI.js';

export default function createGame(createQuestionsNavigator, client) {

    let theQuestionNavigator;
    let secondsPerQuestion = 10;
    let questionTimer = new timer(secondsPerQuestion, handlerEventTime);
    let ui = gameUI();


    function start() {
        ui.setInvisibleComponent(ui.getElement().questionsContainer);
        ui.setOnStart(onStartGame);
        ui.setOnNextQuestion(onNextQuestion);
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
        ui.setInvisibleComponent(ui.getElement().startButton);
    }

    function onNextQuestion() {
        questionTimer.restart();
        loadNextQuestion();
    }

    function gameOver() {
        ui.setInvisibleComponent(ui.getElement().questionsContainer);
        questionTimer.stop();
        ui.setVisibleComponent(ui.getElement().startButton);
    }


    return {
        start,
        questionsNavigator: createQuestionsNavigator
    }
};
