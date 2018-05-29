export default function createGame(createQuestionsNavigator, client) {

    let startButtonUI;
    let questionsContainerUI;
    let nextQuestionButtonUI;
    let questionTitleUI;
    let questionAnswersUI;
    let radioAnswersListUI;
    let timer;
    let seconds;
    let theQuestionNavigator;
    let answerListUI;
    let secondsPerQuestion = 10;

    function start() {
        questionsContainerUI = document.querySelector('.questions__container');
        setInvisibleComponentUI(questionsContainerUI);
        startButtonUI = document.querySelector('.start--button');
        startButtonUI.addEventListener('click', onStartGame);
        questionTitleUI = document.querySelector('.question--title');
        questionAnswersUI = document.querySelectorAll('.question--answer');
        radioAnswersListUI = document.querySelectorAll('.input-radio');
        nextQuestionButtonUI = document.getElementById('next--question--button');
        answerListUI = document.getElementById('answer--list');


        nextQuestionButtonUI.addEventListener('click', onNextQuestion);
        client.getQuestions(function (questions) {
            theQuestionNavigator = createQuestionsNavigator(questions);
        });
    }

    function onStartGame() {
        stopTimer();
        resetTimer(secondsPerQuestion);
        startTimer();
        updateTimerUI();
        theQuestionNavigator.restartQuestions();
        loadNextQuestion();
        setInvisibleComponentUI(startButtonUI);
    }

    function onNextQuestion() {
        stopTimer();
        resetTimer(secondsPerQuestion);
        startTimer();
        updateTimerUI();
        loadNextQuestion();
    }

    function loadNextQuestion() {
        if (theQuestionNavigator.areThereNonVisitedQuestions()) {
            renderQuestionUI(theQuestionNavigator.getNextQuestion());
        }
        else {
            gameOver();
        }
    }

    function gameOver() {
        setInvisibleComponentUI(questionsContainerUI);
        stopTimer();
        setVisibleComponentUI(startButtonUI);

    }

    function startTimer() {
        timer = setInterval(function () {
            updateSeconds(onNextQuestion, updateTimerUI);
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timer);
    }

    function resetTimer(secondsPerQuestion) {
        seconds = secondsPerQuestion;
    }

    function updateTimerUI() {
        let clockUI = document.querySelector('.clock');
        clockUI.innerHTML = seconds;
    }

    function updateSeconds(onTimeout, onTimeChanged) {
        seconds--;
        if (seconds > 0) {
            onTimeChanged();
        }
        else if (seconds === 0) {
            onTimeout();
        }
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

    function setVisibleComponentUI(component) {
        component.style.visibility = "visible";
    }

    function setInvisibleComponentUI(component) {
        component.style.visibility = "hidden";
    }

    return {
        start,
        questionsNavigator: createQuestionsNavigator
    }
};
