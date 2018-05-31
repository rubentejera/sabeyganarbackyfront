export default function gameUI() {
    let questionsContainer = document.querySelector('.questions__container');
    let startButton = document.querySelector('.start--button');
    let questionTitleUI = document.querySelector('.question--title');
    let nextQuestionButton = document.getElementById('next--question--button');
    let answerListUI = document.getElementById('answer--list');
    let clock = document.querySelector('.clock');


    function getElement() {

        return {
            startButton,
            clock,
            nextQuestionButton,
            questionsContainer
        }
    }

    function setClickEventListener(element, action) {
        element.addEventListener('click', action);
    }

     function setOnStart(action){
         setClickEventListener(startButton, action);
     }


    function setElementText(element, text) {
        element.innerHTML = text;

    }


    function setVisibleComponent(component) {
        component.style.visibility = "visible";
    }

    function setInvisibleComponent(component) {
        component.style.visibility = "hidden";
    }

    function renderQuestion(question) {
        let answerOptionsUI = document.querySelectorAll('.answer--option');

        if (answerOptionsUI.length > 0) {
            answerOptionsUI.forEach(function (option) {
                option.remove();
            });
        }

        setElementText(questionTitleUI, question.title);
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

        setVisibleComponent(questionsContainer);
    }

    return {
        setElementText,
        setVisibleComponent,
        setInvisibleComponent,
        renderQuestion,
        getElement,
        setClickEventListener,
        setOnStart,

    }
}