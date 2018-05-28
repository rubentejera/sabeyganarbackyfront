export default function createGame(createQuestionsNavigator, client) {

    let startButton;
    let questionsContainer;
    let nextQuestionButton;
    let questionTitle;
    let questionAnswers;
    let radioAnswersList;
    let timerId;
    let countdown;
    let theQuestionNavigator;

    function start(){
        questionsContainer = document.querySelector('.questions__container');
        // hideContainerPanel();
        // hideComponent(questionsContainer);
        hideComponent(questionsContainer);
        startButton = document.querySelector('.start--button');
        startButton.addEventListener('click', onStartGame);
        questionTitle = document.querySelector('.question--title');
        questionAnswers = document.querySelectorAll('.question--answer');
        radioAnswersList = document.querySelectorAll('.input-radio');
        nextQuestionButton = document.getElementById('next--question--button');


        nextQuestionButton.addEventListener('click', onNextQuestion);
        client.getQuestions(function (questions) {
            theQuestionNavigator = createQuestionsNavigator(questions);
        });
    }

    function onStartGame(){
        resetCountdown();
        updateTimerUI();
        startTimer();
        theQuestionNavigator.restartQuestions();
        loadNextQuestion();
        // hideStartButton();
        hideComponent(startButton);
    }
    function onNextQuestion(){
        loadNextQuestion();
    }
    function loadNextQuestion() {
        resetCountdown();
        updateTimerUI();
        if (theQuestionNavigator.areThereNonVisitedQuestions()) {
            renderQuestion(theQuestionNavigator.getNextQuestion());
        }
        else {
            gameOver();
        }
    }
    function gameOver(){
        hideComponent(questionsContainer);
        stopTimer();
        showComponent(startButton);

    }

    function startTimer() {
        timerId = setInterval(function(){
            updateCountdown(onNextQuestion, updateTimerUI);
        }, 1000);
    }
    function stopTimer(){
        clearInterval(timerId);
    }
    function resetCountdown(){
        countdown = 10;
    }
    function updateTimerUI() {
        let clock = document.querySelector('.clock');
        clock.innerHTML = countdown;
    }
    function updateCountdown(onTimeout, onTimeChanged){
        countdown--;
        if (countdown > 0) {
            onTimeChanged();
        }
        else if (countdown === 0) {
            onTimeout();
        }
    }

    function renderQuestion(question) {
        // showContainerPanel();
        showComponent(questionsContainer);
        questionTitle.innerHTML = (question.title);
        questionTitle.setAttribute('id', question.id);
        for (let i = 0; i < question.answers.length; i++) {
            questionAnswers[i].innerHTML = (question.answers[i].answer);
            radioAnswersList[i].setAttribute('id', question.answers[i].id);
        }
    }

    function showComponent(component){
        component.style.visibility="visible";
    }

    function hideComponent(component) {
        component.style.visibility="hidden";
    }

    return {
        start,
        questionsNavigator: createQuestionsNavigator
    }
};
