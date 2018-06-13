import createGame from '../src/game';
import createQuestionsNavigator from '../src/questionsNavigator';
import gameRules from '../src/gameRules';
import testQuestions from '../src/testQuestions';

jest.setTimeout(30000);

const pug = require('pug');


describe("the game", function () {
    let questions = testQuestions().getQuestions();
    let application;
    let theQuestionNavigator;

    beforeEach(function () {
        document.body.innerHTML = pug.compileFile('./views/main.pug', null)();
        let stubClient = {
            getQuestions: function (callback) {
                callback(questions);
            }
        };
        application = createGame(createQuestionsNavigator, stubClient);
        application.start();
        theQuestionNavigator = application.getQuestionNavigator();

    });


    it('should show the start button when start game', function () {
        expect(document.getElementById('start--button')).not.toBeNull();
    });




    describe("counter", function () {

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
    });


    describe("questions", function () {

        it('answers a question', function () {
            startGame();
            selectAnswer(1);

            goToNextQuestion();

            assertThatSecondQuestionIsRendered();
        });

        it("should not have any selected question at the beginning of the game", function () {
            startGame();
            expect(getSelectedAnswer()).toBe(undefined);
        });

        it("should not have any selected question when go to next testQuestions", function () {
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
    });


    describe("score", function () {

        it("should show 0 on the score UI when start game", function () {
            startGame();
            expect(parseInt(getScoreboard().innerHTML)).toBe(0);
        });


        it("should add more points if it's correct reply success quickly", function () {
            startGame();
            selectAnswer(3);
            goToNextQuestion();
            expect(parseInt(getScoreboard().innerHTML)).toBe(gameRules().pointsToAddQuickReplySuccess);

        });

        it("should add normal points if it's reply success in normal time", function (done) {
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

        it("should substract normal points if it's reply fail in normal time", function (done) {
            startGame();
            selectAnswer(3);
            goToNextQuestion();
            selectAnswer(2);
            let maxTimeNormalReplyInMillis = (gameRules().maxTimeNormalReply) * 1000;

            function onTimeOut() {
                goToNextQuestion();
                expect(parseInt(getScoreboard().innerHTML)).toEqual(
                    gameRules().pointsToAddQuickReplySuccess - gameRules().pointsToSubtractNormalReplyFail);
                done();
            }

            setTimeout(onTimeOut, maxTimeNormalReplyInMillis);
        });

    });


    describe("statistics", function () {

        it("shouldn't be show the statistics if the game is started", function () {
            startGame();
            expect(getStatistics().style.visibility).toBe("hidden");
        });
    });


    function getCounterUIValue() {
        return parseInt(document.querySelector(".clock").innerHTML);
    }

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
