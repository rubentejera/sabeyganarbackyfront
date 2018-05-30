import timer from './timer.js';
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

    function setVisibleComponentUI(component) {
        component.style.visibility = "visible";
    }

    function setInvisibleComponentUI(component) {
        component.style.visibility = "hidden";
    }

    function renderQuestionUI(question) {
        let answerOptionsUI = document.querySelectorAll('.answer--option');

        if (answerOptionsUI.length > 0) {
            answerOptionsUI.forEach(function (option) {
                option.remove();
            });
        }

        questionTitleUI.innerHTML = (question.title);
        questionTitleUI.setAttribute('id', question.id);


        for (let i = 0; i < question.answers.length; i++) {
            let li = document.createElement("li");
            li.setAttribute("class", "answer--option");

            let input = document.createElement("input");
            input.setAttribute("type", "radio");
            input.setAttribute("value", "");
            input.setAttribute("name", "radAnswer");
            input.setAttribute("class", "input-radio");
            input.setAttribute("id", question.answers[i].id);


            let label = document.createElement("label");
            label.setAttribute("class", "question--answer");

            let answerText = document.createTextNode(question.answers[i].answer);

            label.appendChild(answerText);
            li.appendChild(input);
            li.appendChild(label);
            answerListUI.appendChild(li);
        }

        setVisibleComponentUI(questionsContainerUI);
    }

    function updateTimerUI(timer) {
        let clockUI = document.querySelector('.clock');
        clockUI.innerHTML = timer;
    }

    function start() {
        getElementUI();
        setInvisibleComponentUI(questionsContainerUI);
        nextQuestionButtonUI.addEventListener('click', onNextQuestion);
        client.getQuestions(function (questions) {
            theQuestionNavigator = createQuestionsNavigator(questions);
        });
    }

    function loadNextQuestion() {
        if (theQuestionNavigator.areThereNonVisitedQuestions()) {
            renderQuestionUI(theQuestionNavigator.getNextQuestion());
        }
        else {
            gameOver();
        }
    }

    // function timer(seconds, event){
    //     let saveSeconds = seconds;
    //     let counter = 0;
    //     let interval;
    //
    //     function start() {
    //         interval = setInterval(function () {
    //             intervalAction();
    //         }, 1000);
    //     }
    //
    //     function intervalAction(){
    //         decrease();
    //         event(counter);
    //     }
    //
    //     function stop() {
    //         clearInterval(interval);
    //     }
    //
    //     function reset(){
    //         counter = saveSeconds;
    //     }
    //
    //     function decrease(){
    //         counter--;
    //     }
    //
    //     function get(){
    //         return counter;
    //     }
    //
    //     function restart(){
    //         stop();
    //         reset();
    //         start();
    //         event(counter);
    //     }
    //
    //     return{
    //         restart,
    //         get,
    //         stop,
    //     }
    // }

    function handlerEventTime(time){
        updateTimerUI(time);

        if (time <= 0) {
            onNextQuestion();
        }
    }

    questionTimer = new timer(secondsPerQuestion, handlerEventTime);



    function onStartGame() {
        questionTimer.restart();
        theQuestionNavigator.restartQuestions();
        loadNextQuestion();
        setInvisibleComponentUI(startButtonUI);
    }

    function onNextQuestion() {
        questionTimer.restart();
        loadNextQuestion();
    }

    function gameOver() {
        setInvisibleComponentUI(questionsContainerUI);
        questionTimer.stop();
        setVisibleComponentUI(startButtonUI);
    }


    return {
        start,
        questionsNavigator: createQuestionsNavigator
    }
};
