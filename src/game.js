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
    let answerList;
    let answerOption;

    function start(){
        questionsContainer = document.querySelector('.questions__container');
        hideComponent(questionsContainer);
        startButton = document.querySelector('.start--button');
        startButton.addEventListener('click', onStartGame);
        questionTitle = document.querySelector('.question--title');
        questionAnswers = document.querySelectorAll('.question--answer');
        radioAnswersList = document.querySelectorAll('.input-radio');
        nextQuestionButton = document.getElementById('next--question--button');
        answerList = document.getElementById('answer--list');


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
        showComponent(questionsContainer);
        questionTitle.innerHTML = (question.title);
        questionTitle.setAttribute('id', question.id);

        // for (let i = 0; i < question.answers.length; i++) {
        //     questionAnswers[i].innerHTML = (question.answers[i].answer);
        //     radioAnswersList[i].setAttribute('id', question.answers[i].id);
        // }
        answerOption = document.querySelectorAll('.answer--option');
        console.log("***********************",answerOption.length);

        if(answerOption.length>0){
            answerOption.forEach(function(element){
                console.log("BORRO -->", element);
                element.remove();

            });
        }

        for (let i = 0; i < question.answers.length; i++) {
            var li = document.createElement("li",/*{class:"answer--option"}*/);
            li.setAttribute("class","answer--option");

            var input = document.createElement("input"/*, {type:"radio",value:"",name:"radAnswer",class:"input-radio",id:question.answers[i].id}*/);
            input.setAttribute("type", "radio");
            input.setAttribute("value", "");
            input.setAttribute("name", "radAnswer");
            input.setAttribute("class", "input-radio");
            input.setAttribute("id", question.answers[i].id);


            var label = document.createElement("label"/*,{class:"question--answer"}*/);
            label.setAttribute("class","question--answer");

            var answerText = document.createTextNode(question.answers[i].answer);

            label.appendChild(answerText);
            li.appendChild(input);
            li.appendChild(label);
            answerList.appendChild(li);
        }

        // var li = document.createElement("li",{class:"answer--option"});
        // var input = document.createElement("input", {type:"radio",value:"",name:"radAnswer",class:"input-radio"});
        // var label = document.createElement("label",{class:"question--answer"});


        // li.appendChild(input);
        // li.appendChild(label);
        // console.log(li);


    // <li class="answer--option">
    //         <input type="radio" value="" name="radAnswer" class="input-radio">
    //         <label class="question--answer"></label>
    //  </li>

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
