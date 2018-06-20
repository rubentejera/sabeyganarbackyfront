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
        application.init();
        theQuestionNavigator = application.getQuestionNavigator();
    });

    afterEach(function () {
        application.allQuestionsCompleted();
    });


    describe("before start game", function () {
        it('should show the start button when start game', function () {
            expect(document.getElementById('start--button')).not.toBeNull();
        });
    });


    describe("after start game", function () {
        beforeEach(function () {
            startGame();
        });


        describe("counter", function () {

            it("restart the counter time", function (done) {
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
                selectAnswer(1);

                goToNextQuestion();

                assertThatSecondQuestionIsRendered();
            });

            it("should not have any selected question at the beginning of the game", function () {
                expect(getSelectedAnswer()).toBe(undefined);
            });

            it("should not have any selected question when go to next testQuestions", function () {
                selectAnswer(1);
                goToNextQuestion();
                expect(getSelectedAnswer()).toBe(undefined);
            });

            it("should return the same id of selected answer", function () {
                let seletedAnswer = selectAnswer(1);
                expect(getSelectedAnswer()).toBe(parseInt(seletedAnswer.id));
            });

            it("should return correct check of answer", function () {
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
                expect(parseInt(getScore().innerHTML)).toBe(0);
            });


            it("should add more points if it's correct reply success quickly", function () {
                selectFirstCorrectAnswer();
                goToNextQuestion();
                expect(parseInt(getScore().innerHTML)).toBe(gameRules().pointsToAddQuickReplySuccess);

            });

            it("should add normal points if it's reply success in normal time", function (done) {
                selectFirstCorrectAnswer();
                let maxTimeNormalReplyInMillis = (gameRules().maxTimeNormalReply) * 1000;

                function onTimeOut() {
                    goToNextQuestion();
                    expect(parseInt(getScore().innerHTML)).toEqual(gameRules().pointsToAddNormalReplySuccess);
                    done();
                }

                setTimeout(onTimeOut, maxTimeNormalReplyInMillis);
            });

            it("should not be less than 0", function () {
                selectFirstWrongAnswer();
                goToNextQuestion();
                selectSecondWrongAnswer();
                expect(parseInt(getScore().innerHTML)).toEqual(0);
            });

            it("should substract normal points if it's reply fail in quick time", function (done) {
                selectFirstCorrectAnswer();
                goToNextQuestion();
                selectSecondWrongAnswer();
                let maxTimeQuickReplyInMillis = (gameRules().maxTimeQuickReply) * 1000;

                function onTimeOut() {
                    goToNextQuestion();
                    expect(parseInt(getScore().innerHTML)).toEqual(
                        gameRules().pointsToAddQuickReplySuccess - gameRules().pointsToSubtractQuickReplyFail);
                    done();
                }

                setTimeout(onTimeOut, maxTimeQuickReplyInMillis);
            });

            it("should substract normal points if it's reply fail in normal time", function (done) {
                selectFirstCorrectAnswer();
                goToNextQuestion();
                selectSecondWrongAnswer();
                let maxTimeNormalReplyInMillis = (gameRules().maxTimeNormalReply) * 1000;

                function onTimeOut() {
                    goToNextQuestion();
                    expect(parseInt(getScore().innerHTML)).toEqual(
                        gameRules().pointsToAddQuickReplySuccess - gameRules().pointsToSubtractNormalReplyFail);
                    done();
                }

                setTimeout(onTimeOut, maxTimeNormalReplyInMillis);
            });

            it("should substract more points if it is not reply", function (done) {
                selectFirstCorrectAnswer();
                goToNextQuestion();
                let allowTimeForTheNextQuestion = (gameRules().secondsPerQuestion + 1) * 1000;

                function onTimeOut() {
                    expect(parseInt(getScore().innerHTML)).toEqual(
                        gameRules().pointsToAddQuickReplySuccess - gameRules().pointsToSubtractNoReply);
                    done();
                }

                setTimeout(onTimeOut, allowTimeForTheNextQuestion);
            });

        });


        describe("statistics", function () {

            it("shouldn't be show the statistics if the game is started", function () {
                expect(getStatistics()).toBe(null);
            });

            it("should be show the statistics if the game is finished", function () {
                application.allQuestionsCompleted();
                expect(getStatistics()).not.toBe(null);
            });
        });

        describe("ranking", function () {

            it("shouldn't be show the ranking if the game is started", function () {
                expect(getRanking()).toBe(null);
            });

            it("should be show the ranking if the game is finished", function () {
                application.allQuestionsCompleted();
                expect(getRanking()).not.toBe(null);
            });

            it("should be show the current game on the ranking", function () {
                completeAllAnswer();
                enterNameAtTheEndOfTheGame('Rubén');
                expect(getNumberOfElementOnRanking()).toEqual(1);
            });


        });

        function completeAllAnswer() {
            selectFirstCorrectAnswer();
            goToNextQuestion();

            selectSecondCorrectAnswer();
            goToNextQuestion();

            selectThirdCorrectAnswer()
            goToNextQuestion();
        }

        function selectFirstCorrectAnswer() {
            selectAnswer(3);
        }

        function selectFirstWrongAnswer() {
            selectAnswer(2);
        }

        function selectSecondCorrectAnswer() {
            selectAnswer(3);
        }

        function selectSecondWrongAnswer() {
            selectAnswer(2);
        }

        function selectThirdCorrectAnswer() {
            selectAnswer(1);
        }

        function selectThirdWrongAnswer() {
            selectAnswer(2);
        }

        function getCounterUIValue() {
            return parseInt(document.getElementById("clock").innerHTML);
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

        function getScore() {
            return document.getElementById("result--score");
        }

        function getStatistics() {
            return document.getElementById("statistics__container");
        }

        function getRanking() {
            return document.getElementById("ranking__container");
        }

        function getNumberOfElementOnRanking() {
            return document.getElementById("ranking__container").childElementCount;
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
            return currentQuestion.correctAnswer.id === parseInt(selectedAnswer.id);
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
});
