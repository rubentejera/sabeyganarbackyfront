export default function gameUI() {
    let questionsContainer = document.querySelector('.questions__container');
    let startButton;
    // let nextQuestionButton = document.getElementById('next--question--button');
    let nextQuestionButton;
    // let clock = document.querySelector('.clock');
    let clock;
    // let score = document.querySelector('.result--score');
    let score;
    let statisticsContainer = document.getElementById('statistics__container');
    // let statisticsContainer;
    let scoresContainer = document.getElementById('scores__container');
    let intro = document.getElementById('intro');
    let main = document.getElementsByTagName('main')[0];
    let actionToNextQuestion;
    let actionToStartButton;

    function setClickEventListener(element, action) {
        element.addEventListener('click', action);
    }

    function start(startButtonAction, onNextQuestionAction) {
        actionToNextQuestion = onNextQuestionAction;
        actionToStartButton = startButtonAction;
        deleteMain();//TODO DEBERIA FUNCIONAR, FALTA CREAR COMPONENTES
        // deleteQuestions();
        renderIntro();
        renderScores();//TODO Solo cuando sea mas de la 1º vez
        renderStatistics();
        setOnStart(actionToStartButton);
        // setOnNextQuestion(onNextQuestionAction);
        // setInvisibleStatistics();
        // console.log("ACTION ON START!-->",actionToNextQuestion);
    }

    function onStartGame(question) {
        // console.log("ACTION ON ONSTART!-->",actionToNextQuestion);
        deleteIntro();
        deleteScores();
        deleteStatistics();
        // renderMain();
        renderScore();
        renderClock();
        renderQuestion(question);
        renderNextQuestionButton();
        setOnNextQuestion(actionToNextQuestion);
    }

    function setOnStart(action) {
        startButton = document.getElementById('start--button');
        setClickEventListener(startButton, action);
    }

    function setOnNextQuestion(action) {
        nextQuestionButton = document.getElementById('next--question--button');
        setClickEventListener(nextQuestionButton, action);
    }


    function setElementText(element, text) {
        element.innerHTML = text;
    }

    function setClock(text) {
        clock = document.getElementById('clock');
        setElementText(clock, text);
    }

    function setScore(actualScore) {
        score = document.querySelector('.result--score');
        setElementText(score, actualScore);
    }

    function setVisibleComponent(component) {
        component.style.visibility = "visible";
    }

    function setInvisibleComponent(component) {
        component.style.visibility = "hidden";
    }
    //
    // //TODO quitar estas dos y sustituirlas por render y delete
    // function setVisibleStatistics() {
    //     setVisibleComponent(statisticsContainer);
    // }
    //
    // function setInvisibleStatistics() {
    //     setInvisibleComponent(statisticsContainer);
    // }


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

    function deleteElement(node){
        // (node.parentNode.nodeName).remo
        node.remove();
    }

    function deleteIntro() {
        deleteAllChildrenOf(intro);
    }

    function deleteMain() {
        deleteAllChildrenOf(main);
    }

    function deleteScores() {
        deleteAllChildrenOf(scoresContainer);
    }

    function deleteStatistics() {
        statisticsContainer = document.getElementById('statistics__container');
        deleteElement(statisticsContainer);
    }

    function deleteQuestions() {
        deleteAllChildrenOf(questionsContainer);
    }

    function renderClock(){
        let title = document.createElement("H3");
        setElementText(title,"TIEMPO RESTANTE:");

        let clock = document.createElement("span");
        clock.setAttribute("class","clock");
        clock.setAttribute("id","clock");
        setElementText(clock, 12);

        main.appendChild(title);
        main.appendChild(clock);
    }
    function renderMain(){
        renderScore();
        renderClock();
        renderQuestion(question);
        renderNextQuestionButton();
        setOnNextQuestion(actionToNextQuestion);
    }

    function renderScore(){
        let title = document.createElement("H3");
        setElementText(title,"Puntuacion:");

        let score = document.createElement("H3");
        score.setAttribute("class","result--score");
        setElementText(score,0);

        main.appendChild(title);
        main.appendChild(score)
    }

    function renderNextQuestionButton(){
        let button = document.createElement("button");
        button.setAttribute("id","next--question--button");
        setElementText(button, "Pasa a la siguiente pregunta");

        main.appendChild(button);
        // <button id="next--question--button">Pasa a la siguiente pregunta</button>
    }

    function renderStatistics(){
        let boxStatistic = document.createElement("div");
        boxStatistic.setAttribute("id","statistics__container");
        boxStatistic.setAttribute("class","statistics__container");

        main.appendChild(boxStatistic);
        // <div id="statistics__container" class="statistics__container"></div>
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
        setElementText(buttonStart, "Comenzar a Jugar");

        intro.appendChild(ul);
        intro.appendChild(buttonStart);
    }


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

        main.appendChild(questionsContainer);
    }

    return {
        start,
        onStartGame,
        renderQuestion,
        setClock,
        setScore,
        // setVisibleStatistics,
        // setInvisibleStatistics,
        getSelectedAnswer,

    }
}