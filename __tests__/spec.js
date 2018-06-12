import createGame from '../src/game';
import createQuestionsNavigator from '../src/questionsNavigator';
import score from '../src/score';
import gameRules from '../src/gameRules';

jest.setTimeout(30000);

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
    let totalQuestions;
    let currentQuestion;

    beforeEach(function () {
        questionsNavigator = createQuestionsNavigator(questions);
        totalQuestions = questions.length;
    });

    it("get the current question", () => {
        currentQuestion = questionsNavigator.getCurrentQuestion();
        expect(questions).toContain(currentQuestion);
    });

    it("is always pointing to a question", () => {
        let questionAfterTheLast;

        for (let i = 0; i < totalQuestions; i++) {
            if (i == 0) {
                questionsNavigator.getCurrentQuestion();
            } else {
                questionsNavigator.getNextQuestion();
            }
        }

        questionAfterTheLast = questionsNavigator.getNextQuestion();

        expect(questions).toContain(questionAfterTheLast);
        expect(questionsNavigator.areThereNonVisitedQuestions()).toBeFalsy();


    });

    it("does not repeat the last question", () => {
        let lastQuestionVisited = {};

        for (let i = 0; i < totalQuestions; i++) {
            if (i == 0) {
                currentQuestion = questionsNavigator.getCurrentQuestion();
            } else {
                currentQuestion = questionsNavigator.getNextQuestion();
            }
            expect(currentQuestion).not.toEqual(lastQuestionVisited);
            lastQuestionVisited = currentQuestion;
        }
    });

    it("knows when the questions are all visited", () => {
        for (let i = 0; i < totalQuestions; i++) {
            if (i == 0) {
                questionsNavigator.getCurrentQuestion();
            } else {
                questionsNavigator.getNextQuestion();
            }
        }
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
            expect(counterInDOM).toEqual(gameRules().secondsPerQuestion);
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


    it("should show 0 on the score UI when start game", function () {
        startGame();
        expect(parseInt(getScoreboard().innerHTML)).toBe(0);
    });


    it("should add more points if it's reply quickly", function () {
        startGame();
        selectAnswer(3);
        goToNextQuestion();
        expect(parseInt(getScoreboard().innerHTML)).toBe(gameRules().pointsToAddQuickReplySuccess);

    });

    it("should add normal points if it's reply in normal time", function (done) {
        startGame();
        selectAnswer(3);
        let maxTimeNormalReplyInMillis = (gameRules().maxTimeNormalReply) * 1000;

        function onTimeOut() {
            goToNextQuestion();
            expect(parseInt(getScoreboard().innerHTML)).toEqual(gameRules().pointsToAddNormalReplySuccess);
            done();
        }

        setTimeout(onTimeOut, maxTimeNormalReplyInMillis);
    });

    it("shouldn't be show the statistics if the game is started", function () {
        startGame();
        expect(getStatistics().style.visibility).toBe("hidden");
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

    function getScoreboard() {
        return document.querySelector(".result--score");
    }

    function getStatistics() {
        return document.getElementById("statistics__container");
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

describe("Scoreboard", function () {
    let scoreboardGame;

    beforeEach(function () {
        scoreboardGame = new score();
    });

    it("should return 0 when score is started", function () {
        expect(scoreboardGame.getScore()).toEqual(0);
    });

    it("should increment a quantity to the score", function () {
        scoreboardGame.increment(3);
        expect(scoreboardGame.getScore()).toEqual(3);
    });

    it("should decrement a quantity to the score", function () {
        scoreboardGame.increment(3);
        scoreboardGame.decrement(2);
        expect(scoreboardGame.getScore()).toEqual(1);
    });

    it("should be 0 the minimum score", function () {
        scoreboardGame.decrement(2);
        expect(scoreboardGame.getScore()).toEqual(0);
    });

});

// describe("Statistics", function () {
//
//
//     // beforeEach(function () {
//     //     scoreboardGame = new score();
//     // });
//
//     it("shouldn't be show the statistics if the game is started", function () {
//         getS
//         expect(scoreboardGame.getScore()).toEqual(0);
//     });
//
//
// });
