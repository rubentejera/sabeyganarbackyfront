import timer from './timer.js';
import gameUI from './gameUI.js';

export default function createGame(createQuestionsNavigator, client) {

    let startButtonUI;
    let questionsContainerUI;
    let nextQuestionButtonUI;
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
        startButtonUI = document.querySelector('.start--button');
        startButtonUI.addEventListener('click', onStartGame);
        questionTitleUI = document.querySelector('.question--title');
        questionAnswersUI = document.querySelectorAll('.question--answer');
        radioAnswersListUI = document.querySelectorAll('.input-radio');
        nextQuestionButtonUI = document.getElementById('next--question--button');
        answerListUI = document.getElementById('answer--list');
    }

    // function setVisibleComponent(component) {
    //     component.style.visibility = "visible";
    // }
    //
    // function setInvisibleComponent(component) {
    //     component.style.visibility = "hidden";
    // }

    // function renderQuestionUI(question) {
    //     let answerOptionsUI = document.querySelectorAll('.answer--option');
    //
    //     if (answerOptionsUI.length > 0) {
    //         answerOptionsUI.forEach(function (option) {
    //             option.remove();
    //         });
    //     }
    //
    //     questionTitleUI.innerHTML = (question.title);
    //     questionTitleUI.setAttribute('id', question.id);
    //
    //
    //     for (let i = 0; i < question.answers.length; i++) {
    //         let li = document.createElement("li");
    //         li.setAttribute("class", "answer--option");
    //
    //         let input = document.createElement("input");
    //         input.setAttribute("type", "radio");
    //         input.setAttribute("value", "");
    //         input.setAttribute("name", "radAnswer");
    //         input.setAttribute("class", "input-radio");
    //         input.setAttribute("id", question.answers[i].id);
    //
    //
    //         let label = document.createElement("label");
    //         label.setAttribute("class", "question--answer");
    //
    //         let answerText = document.createTextNode(question.answers[i].answer);
    //
    //         label.appendChild(answerText);
    //         li.appendChild(input);
    //         li.appendChild(label);
    //         answerListUI.appendChild(li);
    //     }
    //
    //     ui.setVisibleComponent(questionsContainerUI);
    // }

    function start() {
        getElementUI();
        ui.setInvisibleComponent(questionsContainerUI);
        nextQuestionButtonUI.addEventListener('click', onNextQuestion);
        client.getQuestions(function (questions) {
            theQuestionNavigator = createQuestionsNavigator(questions);
        });
    }

    function loadNextQuestion() {
        if (theQuestionNavigator.areThereNonVisitedQuestions()) {
            ui.renderQuestionUI(theQuestionNavigator.getNextQuestion());
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
        ui.setInvisibleComponent(startButtonUI);
    }

    function onNextQuestion() {
        questionTimer.restart();
        loadNextQuestion();
    }

    function gameOver() {
        ui.setInvisibleComponent(questionsContainerUI);
        questionTimer.stop();
        ui.setVisibleComponent(startButtonUI);
    }


    return {
        start,
        questionsNavigator: createQuestionsNavigator
    }
};
