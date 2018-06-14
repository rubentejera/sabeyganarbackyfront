export default function gameUI() {
    let questionsContainer = document.querySelector('.questions__container');
    let startButton;
    let nextQuestionButton = document.getElementById('next--question--button');
    let clock = document.querySelector('.clock');
    let score = document.querySelector('.result--score');
    let statisticsContainer = document.querySelector('.statistics__container');
    let scoresContainer = document.getElementById('scores__container');
    let intro = document.getElementById('intro');
    let answerOptionsUI = [];


    function setClickEventListener(element, action) {
        element.addEventListener('click', action);
    }

    function start(startButtonAction, onNextQuestionAction) {
        deleteQuestions();
        renderIntro();
        renderScores();//TODO Solo cuando sea mas de la 1º vez
        setOnStart(startButtonAction);
        setOnNextQuestion(onNextQuestionAction);
        setInvisibleQuestions();
        setInvisibleStatistics();
    }

    function onStartGame(question) {
        deleteIntro();
        deleteScores();
        renderQuestion(question);
    }

    function setOnStart(action) {
        startButton = document.getElementById('start--button');
        setClickEventListener(startButton, action);
    }

    function setOnNextQuestion(action) {
        setClickEventListener(nextQuestionButton, action);
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

    function setVisibleComponent(component) {
        component.style.visibility = "visible";
    }

    function setVisibleQuestions() {
        setVisibleComponent(questionsContainer);
    }

    function setInvisibleComponent(component) {
        component.style.visibility = "hidden";
    }

    function setInvisibleQuestions() {
        setInvisibleComponent(questionsContainer);
    }

    function setVisibleStatistics() {
        setVisibleComponent(statisticsContainer);
    }

    function setInvisibleStatistics() {
        setInvisibleComponent(statisticsContainer);
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


    function deleteAllChildrenOf(parent){
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    function deleteIntro() {
        deleteAllChildrenOf(intro);
    }

    function deleteIntro() {
        deleteAllChildrenOf(intro);
    }

    function deleteScores() {
        deleteAllChildrenOf(scoresContainer);
    }

    function deleteQuestions() {
        deleteAllChildrenOf(questionsContainer);
    }

    function renderScores(){
        let title = document.createElement("H2");
        setElementText(title, "MARCADORES");

        scoresContainer.appendChild(title);
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

        let buttonStart = document.createElement("button");
        buttonStart.setAttribute("type", "button");
        buttonStart.setAttribute("id", "start--button");
        buttonStart.setAttribute("class", "start--button");
        setElementText(buttonStart, "Comenzar a Jugarrr");

        intro.appendChild(ul);
        intro.appendChild(buttonStart);
    }

    // function deleteAllAnswerVisibles(){
    //     answerOptionsUI = document.querySelectorAll('.answer--option');
    //
    //     if (answerOptionsUI.length > 0) {
    //         answerOptionsUI.forEach(function (option) {
    //             option.remove();
    //         });
    //     }
    // }

    function renderQuestion(question) {
        deleteQuestions();

        let questionTitle = document.createElement("H3");
        questionTitle.setAttribute('id', question.id);
        questionTitle.setAttribute('class','question--title');
        setElementText(questionTitle, question.title);

        let ul = document.createElement("ul");
        ul.setAttribute("id","answer--list");

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
        setElementText(description, "Selecciona la respues que creas correcta");


        questionsContainer.appendChild(questionTitle);
        questionsContainer.appendChild(ul);
        questionsContainer.appendChild(description);

        setVisibleQuestions();
    }

    return {
        start,
        onStartGame,
        renderQuestion,
        setClock,
        setScore,
        setVisibleStatistics,
        setInvisibleStatistics,
        getSelectedAnswer,

    }
}