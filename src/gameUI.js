export default function gameUI(startButtonAction, onNextQuestionAction, onEnterName) {
    let questionsContainer;
    let startButton;
    let nextQuestionButton;
    let playAgainButton;
    let enterNameButton;
    let userNameIntroduced;
    let clock;
    let score;
    let intro = document.getElementById('intro');
    let main = document.getElementsByTagName('main')[0];
    let actionToStartButton = startButtonAction;
    let actionToNextQuestion = onNextQuestionAction;
    let actionToEnterName = onEnterName;

    function setClickEventListener(element, action) {
        element.addEventListener('click', action);
    }

    function initialState() {
        deleteAllChildrenOf(main);
        renderIntro(actionToStartButton);
    }

    function startGameState(question) {
        deleteAllChildrenOf(intro);
        deleteAllChildrenOf(main);
        renderScore();
        renderClock();
        renderQuestions();
        renderNextQuestionButton(actionToNextQuestion);
        nextQuestionState(question);
    }

    function nextQuestionState(question) {
        deleteAllChildrenOf(questionsContainer);
        renderNextQuestion(question);
    }

    function allQuestionsCompletedState() {
        deleteAllChildrenOf(main);
        renderEnterName(actionToEnterName);
    }

    function gameOverState(ranking, statistics) {
        deleteAllChildrenOf(main);
        renderPlayAgain();

        if (ranking) {
            renderRanking(ranking);
        }

        if (statistics) {
            renderStatistics(statistics);
        }

    }

    function renderNextQuestion(question) {
        let questionTitle = document.createElement("H3");
        questionTitle.setAttribute('id', question.id);
        questionTitle.setAttribute('class', 'question-title');
        setTextToDomElement(questionTitle, question.title);

        let ul = document.createElement("ul");
        ul.setAttribute("id", "answer-list");

        for (let i = 0; i < question.answers.length; i++) {
            let li = document.createElement("li");
            li.setAttribute("class", "answer-option");

            let input = document.createElement("input");
            input.setAttribute("type", "radio");
            input.setAttribute("value", "");
            input.setAttribute("name", "radAnswer");
            input.setAttribute("class", "input-radio");
            input.setAttribute("id", question.answers[i].id);


            let label = document.createElement("label");
            label.setAttribute("class", "question-answer");

            let answerText = document.createTextNode(question.answers[i].answer);

            label.appendChild(answerText);
            li.appendChild(input);
            li.appendChild(label);
            ul.appendChild(li);
        }

        let description = document.createElement("p");
        setTextToDomElement(description, "Selecciona la respuesta que creas correcta");

        questionsContainer.appendChild(questionTitle);
        questionsContainer.appendChild(ul);
        questionsContainer.appendChild(description);
    }


    function setTextToDomElement(element, text) {
        element.innerHTML = text;
    }

    function setClock(text) {
        setTextToDomElement(clock, text);
    }


    function setScore(actualScore) {
        setTextToDomElement(score, actualScore);
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


    function renderClock() {
        let title = document.createElement("H3");
        setTextToDomElement(title, "TIEMPO RESTANTE:");

        let clockValue = document.createElement("span");
        clockValue.setAttribute("id", "clock");
        setTextToDomElement(clockValue, 12);

        main.appendChild(title);
        main.appendChild(clockValue);

        clock = document.getElementById('clock');
    }

    function renderQuestions() {
        let boxQuestions = document.createElement("div");
        boxQuestions.setAttribute("id", "questions-container");

        main.appendChild(boxQuestions);

        questionsContainer = document.getElementById("questions-container");
    }

    function renderScore() {
        let title = document.createElement("H3");
        setTextToDomElement(title, "Puntuacion:");

        let scoreValue = document.createElement("H3");
        scoreValue.setAttribute("id", "result-score");
        setTextToDomElement(scoreValue, 0);

        main.appendChild(title);
        main.appendChild(scoreValue);

        score = document.getElementById('result-score');
    }

    function renderPlayAgain() {
        let button = document.createElement("button");
        button.setAttribute("id", "retry-start-button");
        setTextToDomElement(button, "Volver a Jugar");

        main.appendChild(button);

        playAgainButton = document.getElementById('retry-start-button');

        setClickEventListener(playAgainButton, () =>
            initialState(actionToStartButton, actionToNextQuestion, actionToEnterName)
        );
    }

    function renderNextQuestionButton(action) {
        let button = document.createElement("button");
        button.setAttribute("id", "next-question-button");
        setTextToDomElement(button, "Pasa a la siguiente pregunta");

        main.appendChild(button);

        nextQuestionButton = document.getElementById('next-question-button');

        setClickEventListener(nextQuestionButton, action);
    }

    function renderEnterName(action) {
        let boxEnterName = document.createElement("div");
        boxEnterName.setAttribute("id", "entername-container");

        let title = document.createElement("H2");
        setTextToDomElement(title, "Completa tu Nombre Para Ver Los Resultados");
        boxEnterName.appendChild(title);

        let input = document.createElement("input");
        input.setAttribute("id", "enter-name-input");
        input.setAttribute("type", "text");
        input.setAttribute("maxlength", "30");
        input.setAttribute("placeholder", "Introduce Aquí Tu Nombre");
        boxEnterName.appendChild(input);

        let button = document.createElement("button");
        button.setAttribute("id", "enter-name-button");
        setTextToDomElement(button, "Ok");

        boxEnterName.appendChild(button);
        main.appendChild(boxEnterName);


        userNameIntroduced = document.getElementById("enter-name-input");
        enterNameButton = document.getElementById('enter-name-button');


        setClickEventListener(enterNameButton, function () {
            let user = getUserNameIntroduced();
            action(user);
        });
    }

    function getUserNameIntroduced() {
        return userNameIntroduced.value;
    }

    function renderStatistics(statistic) {
        let boxStatistics = document.createElement("div");
        boxStatistics.setAttribute("id", "statistics-container");

        let title = document.createElement("H2");
        setTextToDomElement(title, "ESTADISTICAS");
        boxStatistics.appendChild(title);


        renderDetailsStatistics("success-answers","PREGUNTAS CORRECTAS",statistic.successAnswer,boxStatistics);
        renderDetailsStatistics("percent-success-answers","% PREGUNTAS CORRECTAS",`${statistic.percentSuccessAnswer}%`,boxStatistics);
        renderDetailsStatistics("fail-answers","PREGUNTAS INCORRECTAS",statistic.failAnswer,boxStatistics);
        renderDetailsStatistics("percent-fail-answers","% PREGUNTAS INCORRECTAS",`${statistic.percentFailAnswer}%`,boxStatistics);
        renderDetailsStatistics("noreply","PREGUNTAS SIN RESPUESTA",statistic.noReply,boxStatistics);
        renderDetailsStatistics("percent-noreply","% PREGUNTAS SIN RESPUESTA",`${statistic.percentNoReply}%`,boxStatistics);
        renderDetailsStatistics("avg-per-question","TIEMPO MEDIO POR PREGUNTA",`${statistic.averageTimePerQuestion} seg`,boxStatistics);
        renderDetailsStatistics("total-time","TIEMPO TOTAL",`${statistic.totalTime} seg`,boxStatistics);

        main.appendChild(boxStatistics);
    }

    function renderDetailsStatistics(nameDetail,titleValue,dataValue,boxStatistics){
        let boxPercentSucessAnswers = document.createElement("div");
        boxPercentSucessAnswers.setAttribute("id", `${nameDetail}__statistics-container`);

        let title = document.createElement("H5");
        setTextToDomElement(title, `${titleValue}`);
        boxPercentSucessAnswers.appendChild(title);

        let value = document.createElement("p");
        value.setAttribute("id",`${nameDetail}`);
        setTextToDomElement(value, `${dataValue}`);
        boxPercentSucessAnswers.appendChild(value);

        boxStatistics.appendChild(boxPercentSucessAnswers);
    }


    function renderRanking(ranking) {
        let boxRanking = document.createElement("div");
        boxRanking.setAttribute("id", "ranking-container");

        let title = document.createElement("H2");
        setTextToDomElement(title, "RANKING");

        boxRanking.appendChild(title);

        if (ranking) {
            let orderList = document.createElement('lo')
            orderList.setAttribute("id","order-list-ranking");

            ranking.forEach(function (position) {
                let listItem = document.createElement('li');
                let text = position.score + " - " + position.name;
                setTextToDomElement(listItem, text);

                orderList.appendChild(listItem);
            });

            boxRanking.appendChild(orderList);
        }
        main.appendChild(boxRanking);
    }

    function renderIntro(action) {
        const INTROTEXTS = [
            "Tienes 12 segundos para responder cada pregunta",
            "La puntuación depende del tiempo que tardes en contestar",
            "Las respuestas incorrectas y las preguntas que no se respondan restan puntos"
        ];

        let ul = document.createElement("ul");

        for (let numText = 0; numText < INTROTEXTS.length; numText++) {
            let li = document.createElement("li");
            setTextToDomElement(li, INTROTEXTS[numText]);
            ul.appendChild(li);
        }

        intro.appendChild(ul);

        let buttonStart = document.createElement("button");
        buttonStart.setAttribute("type", "button");
        buttonStart.setAttribute("id", "start-button");
        setTextToDomElement(buttonStart, "Comenzar a Jugar");

        intro.appendChild(buttonStart);

        startButton = document.getElementById('start-button');

        setClickEventListener(startButton, action);
    }


    return {
        initialState,
        startGameState,
        nextQuestionState,
        allQuestionsCompletedState,
        gameOverState,
        setClock,
        setScore,
        getSelectedAnswer,
    }
}