export default function gameUI() {
    let questionsContainer;
    let startButton;
    let playAgainButton;
    let clock;
    let score;
    let intro = document.getElementById('intro');
    let main = document.getElementsByTagName('main')[0];
    let actionToNextQuestion;
    let actionToStartButton;

    function setClickEventListener(element, action) {
        element.addEventListener('click', action);
    }

    function initialState(startButtonAction, onNextQuestionAction) {
        actionToStartButton = startButtonAction;
        actionToNextQuestion = onNextQuestionAction;
        deleteAllChildrenOfMain();
        renderIntro();
        renderStartButton();
        setOnStart(actionToStartButton);
    }

    function finishState() {
        deleteAllChildrenOfMain();
        renderPlayAgain();
        setOnPlayAgain();

        renderScores();
        renderStatistics();
    }

    function startedState(question) {
        deleteAllChildrenOfIntro();
        deleteAllChildrenOfMain();

        renderScore();
        renderClock();
        renderQuestions();
        renderNextQuestionButton();
        setOnNextQuestion(actionToNextQuestion);
        nextQuestionState(question);
    }

    function nextQuestionState(question) {
        deleteAllChildrenOfQuestions();

        let questionTitle = document.createElement("H3");
        questionTitle.setAttribute('id', question.id);
        questionTitle.setAttribute('class', 'question--title');
        setElementText(questionTitle, question.title);

        let ul = document.createElement("ul");
        ul.setAttribute("id", "answer--list");

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
            ul.appendChild(li);
        }

        let description = document.createElement("p");
        setElementText(description, "Selecciona la respuesta que creas correcta");

        questionsContainer.appendChild(questionTitle);
        questionsContainer.appendChild(ul);
        questionsContainer.appendChild(description);
    }

    function setOnStart(action) {
        setClickEventListener(startButton, action);
    }

    function setOnNextQuestion(action) {
        setClickEventListener(playAgainButton, action);
    }


    function setElementText(element, text) {
        element.innerHTML = text;
    }

    function setClock(text) {
        setElementText(clock, text);
    }

    function setScore(actualScore) {
        setElementText(score, actualScore);
    }


    function getSelectedAnswer() {
        let radioButtons = document.getElementsByClassName("input-radio");
        for (let index = 0; index < radioButtons.length; index++) {
            if (radioButtons[index].checked) {
                return radioButtons[index]
            }
        }
        return undefined;
    }


    function deleteAllChildrenOf(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }


    function deleteAllChildrenOfIntro() {
        deleteAllChildrenOf(intro);
    }

    function deleteAllChildrenOfMain() {
        deleteAllChildrenOf(main);
    }


    function deleteAllChildrenOfQuestions() {
        deleteAllChildrenOf(questionsContainer);
    }

    function renderClock() {
        let title = document.createElement("H3");
        setElementText(title, "TIEMPO RESTANTE:");

        let clockValue = document.createElement("span");
        clockValue.setAttribute("class", "clock");
        clockValue.setAttribute("id", "clock");
        setElementText(clockValue, 12);

        main.appendChild(title);
        main.appendChild(clockValue);

        clock = document.getElementById('clock');
    }



    function renderQuestions() {
        let boxQuestions = document.createElement("div");
        boxQuestions.setAttribute("id", "questions__container");
        boxQuestions.setAttribute("class", "questions__container");

        main.appendChild(boxQuestions);

        questionsContainer = document.getElementById("questions__container");
    }

    function renderScore() {
        let title = document.createElement("H3");
        setElementText(title, "Puntuacion:");

        let scoreValue = document.createElement("H3");
        scoreValue.setAttribute("class", "result--score");
        setElementText(scoreValue, 0);

        main.appendChild(title);
        main.appendChild(scoreValue);

        score = document.querySelector('.result--score');
    }

    function renderPlayAgain() {
        let button = document.createElement("button");
        button.setAttribute("id", "retry--start--button");
        setElementText(button, "Volver a Jugar");

        main.appendChild(button);
    }

    function setOnPlayAgain() {
        playAgainButton = document.getElementById('retry--start--button');
        setClickEventListener(playAgainButton, () => initialState(actionToStartButton, actionToNextQuestion));
    }

    function renderNextQuestionButton() {
        let button = document.createElement("button");
        button.setAttribute("id", "next--question--button");
        setElementText(button, "Pasa a la siguiente pregunta");

        main.appendChild(button);

        playAgainButton = document.getElementById('next--question--button');
    }

    function renderStatistics() {
        let boxStatistic = document.createElement("div");
        boxStatistic.setAttribute("id", "statistics__container");
        boxStatistic.setAttribute("class", "statistics__container");

        let title = document.createElement("H2");
        setElementText(title, "ESTADISTICAS");
        boxStatistic.appendChild(title);

        main.appendChild(boxStatistic);
    }


    function renderScores() {
        let boxScores = document.createElement("div");
        boxScores.setAttribute("id", "scores__container");
        boxScores.setAttribute("class", "scores__container");

        let title = document.createElement("H2");
        setElementText(title, "MARCADORES");

        boxScores.appendChild(title);

        main.appendChild(boxScores);
    }

    function renderIntro() {
        const INTROTEXTS = [
            "Tienes 12 segundos para responder cada pregunta",
            "La puntuación depende del tiempo que tardes en contestar",
            "Las respuestas incorrectas y las preguntas que no se respondan restan puntos"
        ]

        let ul = document.createElement("ul");

        for (let numText = 0; numText < INTROTEXTS.length; numText++) {
            let li = document.createElement("li");
            setElementText(li, INTROTEXTS[numText]);
            ul.appendChild(li);
        }

        intro.appendChild(ul);
    }

    function renderStartButton(){
        let buttonStart = document.createElement("button");
        buttonStart.setAttribute("type", "button");
        buttonStart.setAttribute("id", "start--button");
        buttonStart.setAttribute("class", "start--button");
        setElementText(buttonStart, "Comenzar a Jugar");

        intro.appendChild(buttonStart);

        startButton = document.getElementById('start--button');
    }

    return {
        initialState,
        startedState,
        nextQuestionState,
        finishState,
        setClock,
        setScore,
        getSelectedAnswer,

    }
}