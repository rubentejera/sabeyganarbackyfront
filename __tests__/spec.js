import createGame from '../src/game';
import createQuestionsNavigator from '../src/questionsNavigator';
import scoreboard from '../src/scoreboard';

const pug = require('pug');

let questions = [
    {
        id: 10,
        title: 'Foo',
        answers: [
            {id: 0, answer: '25'},
            {id: 1, answer: '33'},
            {id: 2, answer: '37'}
        ],
        correctAnswer: {id: 2}
    },
    {
        id: 11,
        title: 'Pero que dices muchacho?',
        answers: [
            {id: 0, answer: 'Lusaka'},
            {id: 1, answer: 'Harare'},
            {id: 2, answer: 'Canarias'}
        ],
        correctAnswer: {id: 2}
    },
    {
        id: 12,
        title: 'Nombre de Colón?',
        answers: [
            {id: 0, answer: 'Cristobal'},
            {id: 1, answer: 'Santiago'},
            {id: 2, answer: 'Pepito'}
        ],
        correctAnswer: {id: 0}
    }
];

describe("the questions navigator", () => {
    let questionsNavigator;

    beforeEach(function () {
        questionsNavigator = createQuestionsNavigator(questions);
    });

    it("get the current question", () => {
        let question = questionsNavigator.getNextQuestion();
        expect(questions).toContain(question);
    });

    it("is always pointing to a question", () => {
        let question = questionsNavigator.getNextQuestion();
        expect(questions).toContain(question);
    });

    it("does not repeat the last question", () => {
        let question1 = questionsNavigator.getNextQuestion();
        let question2 = questionsNavigator.getNextQuestion();
        let question3 = questionsNavigator.getNextQuestion();

        expect(question1).not.toEqual(question2);
        expect(question2).not.toEqual(question3);
    });

    it("knows when the questions are all visited", () => {
        let nextToLast = questions.length - 1;
        for (let i = 0; i < nextToLast; i++) {
            questionsNavigator.getNextQuestion();
            expect(questionsNavigator.areThereNonVisitedQuestions()).toBeTruthy();
        }
        questionsNavigator.getNextQuestion();
        expect(questionsNavigator.areThereNonVisitedQuestions()).toBeFalsy();
    });
});

describe("the game", function () {
    let game;
    let theQuestionNavigator;

    beforeEach(function () {
        document.body.innerHTML = pug.compileFile('./views/main.pug', null)();
        let stubClient = {
            getQuestions: function (callback) {
                callback(questions);
            }
        };
        game = createGame(createQuestionsNavigator, stubClient);
        game.start();
        theQuestionNavigator = game.getQuestionNavigator();

    });

    it('loads the markup', function () {
        expect(
            document.getElementById('start--button'))
            .not.toBeNull();
    });

    it('answers a question', function () {
        startGame();
        selectAnswer(1);

        goToNextQuestion();

        assertThatSecondQuestionIsRendered();
    });

    function getCounterUIValue() {
        return parseInt(document.querySelector(".clock").innerHTML);
    }

    it("restart the counter time", function (done) {
        startGame();
        selectAnswer(1);
        goToNextQuestion();
        const counterInDOM = getCounterUIValue();

        function onTimeout() {
            expect(counterInDOM).toEqual(10);
            done();
        }

        setTimeout(onTimeout, 1000);
    });

    it("should not have any selected question at the beginning of the game", function () {
        startGame();
        expect(getSelectedAnswer()).toBe(undefined);
    });

    it("should not have any selected question when go to next questions", function () {
        startGame();
        selectAnswer(1);
        goToNextQuestion();
        expect(getSelectedAnswer()).toBe(undefined);
    });

    it("should return the same id of selected answer", function () {
        startGame();
        let seletedAnswer = selectAnswer(1);
        expect(getSelectedAnswer()).toBe(parseInt(seletedAnswer.id));
    });

    it("should return correct check of answer", function () {
        startGame();
        let seletedAnswer = selectAnswer(3);
        expect(checkAnswer(questions[0], seletedAnswer)).toBeTruthy();

        goToNextQuestion();
        seletedAnswer = selectAnswer(3);
        expect(checkAnswer(questions[1], seletedAnswer)).toBeTruthy();

        goToNextQuestion();
        seletedAnswer = selectAnswer(3);
        expect(checkAnswer(questions[2], seletedAnswer)).toBeFalsy();
    });


    it("should show 0 on the scoreboard UI when start game", function () {
        startGame();
        let scoreboard = document.querySelector(".result--score");
        expect(parseInt(scoreboard.innerHTML)).toBe(0);
    });


    xit("should add more points if it's respond quickly", function () {
        startGame();
        selectAnswer(3);
        goToNextQuestion();
        expect(parseInt(scoreboard.innerHTML)).toBe(3);

    });


    function getQuestionTitleElement() {
        return document.querySelector('.question--title');
    }

    function expectFirstQuestionToBeRendered() {
        let questionTitle = getQuestionTitleElement();
        expect(Number(questionTitle.id)).toEqual(Number(questions[0].id));
    }


    function startGame() {
        let buttonStart = document.getElementById('start--button');
        buttonStart.click();
        expectFirstQuestionToBeRendered();
    }

    function getAnswers() {
        return document.getElementsByClassName('input-radio');
    }

    function selectAnswer(num) {
        let answerSeleted = getAnswers()[num - 1];
        answerSeleted.click();
        return answerSeleted;
    }

    function getSelectedAnswer() {
        let answers = getAnswers();
        for (let index = 0; index < answers.length; index++) {
            if (answers[index].checked) {
                return parseInt(answers[index].id);
            }
        }
        return undefined;
    }

    function checkAnswer(currentQuestion, selectedAnswer) {
        if (currentQuestion.correctAnswer.id === parseInt(selectedAnswer.id)) {
            return true;
        } else {
            return false;
        }
    }

    function goToNextQuestion() {
        let nextQuestionButton = document.getElementById('next--question--button');
        nextQuestionButton.click();
    }

    function assertThatSecondQuestionIsRendered() {
        let questionTitle = getQuestionTitleElement();
        expect(Number(questionTitle.id)).toEqual(Number(questions[1].id));
        expect(questionTitle.innerHTML).toEqual(questions[1].title);
    }
});


// describe("Check Questions", function () {
//     it("should add more points if it's respond quickly",function(){
//
//         expect(score).toEqual(3);
//     });
// });

describe("Scoreboard", function () {
    let scoreboardGame;

    beforeEach(function () {
        scoreboardGame = new scoreboard();
    });

    it("should return 0 when scoreboard is started", function () {
        expect(scoreboardGame.getScore()).toEqual(0);
    });

    it("should increment a quantity to the scoreboard", function () {
        scoreboardGame.increment(3);
        expect(scoreboardGame.getScore()).toEqual(3);
    });

    it("should decrement a quantity to the scoreboard", function () {
        scoreboardGame.increment(3);
        scoreboardGame.decrement(2);
        expect(scoreboardGame.getScore()).toEqual(1);
    });

    it("should be 0 the minimum score", function () {
        scoreboardGame.decrement(2);
        expect(scoreboardGame.getScore()).toEqual(0);
    });

});
