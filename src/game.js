import timer from './timer.js';
import gameUI from './gameUI.js';
import score from './score.js';
import ranking from './ranking.js';
import gameRules from './gameRules.js';

export default function createGame(createQuestionsNavigator, serverQuestions) {

    let theQuestionNavigator;
    let secondsPerQuestion = gameRules().secondsPerQuestion;
    let questionTimer = new timer(secondsPerQuestion, handlerEventTime);
    let gameScore = new score();
    let gameRanking = new ranking();
    let ui = gameUI(handlerEventOnStartGame, handlerEventOnNextQuestion, handlerEventOnEnterName);

    function getQuestionNavigator() {
        return theQuestionNavigator;
    }

    function init() {
        ui.initialState();

        serverQuestions.getQuestions(function (questions) {
            theQuestionNavigator = createQuestionsNavigator(questions);
        });
    }

    function handlerEventTime(time) {
        ui.setClock(time);

        if (time <= 0) {
            handlerEventOnNextQuestion();
        }
    }


    function handlerEventOnEnterName(name) {//TODO Statistics

        gameRanking.addScore({name: name, score: gameScore.getScore()});


        let statisticsExample = [
            {
                name: "Maria",
                score: 13
            },
            {
                name: "Pepe",
                score: 10
            },
            {
                name: "Juan",
                score: 9
            }
        ];

        ui.gameOverState(gameRanking.getRanking(), statisticsExample);
    }

    function handlerEventOnStartGame() {
        theQuestionNavigator.restartQuestions();
        ui.startGameState(theQuestionNavigator.getCurrentQuestion());
        questionTimer.restart();
        gameScore.restart();
        updateUIScore();
    }

    function handlerEventOnNextQuestion() {
        let currentQuestion = theQuestionNavigator.getCurrentQuestion();
        let selectedAnswer = ui.getSelectedAnswer();
        let currentTimer = getTimeElapsed();

        if (recalculateScore(currentQuestion, selectedAnswer, currentTimer)) {
            // recalculateStatistic(preguntaAcertadaOIncorrecta, )
            goToNextQuestion();
        } else {
            //TODO Manejar Error
        }

    }


    function recalculateScore(currentQuestion, selectedAnswer, currentTimer) {
        if (questionTimer.get() !== 0) {
            if (selectedAnswer) {
                if (isAnswerCorrect(currentQuestion, selectedAnswer)) {
                    recalculateScoreIfSuccess(currentTimer);

                } else {
                    recalculateScoreIfFail(currentTimer);
                }
                return true;

            } else {
                console.log("NO DEBERIA PODER ENTRAR AQUI SIN SELECCIONAR UNA OPCION");
                return false;
            }

        } else {
            recalculateScoreIfNoReply();
            return true;
        }
    }


    function updateUIScore() {
        ui.setScore(gameScore.getScore());
    }

    function getTimeElapsed() {
        return secondsPerQuestion - questionTimer.get();
    }


    function goToNextQuestion() {
        if (theQuestionNavigator.areThereNonVisitedQuestions()) {
            ui.nextQuestionState(theQuestionNavigator.getNextQuestion());
            updateUIScore();
            questionTimer.restart();

        } else {
            allQuestionsCompleted();
        }
    }


    function isAnswerCorrect(currentQuestion, selectedAnswer) {
        return currentQuestion.correctAnswer.id === parseInt(selectedAnswer.id);
    }


    function recalculateScoreIfSuccess(time) {
        if (time <= gameRules().maxTimeQuickReply) {
            gameScore.increment(gameRules().pointsToAddQuickReplySuccess);

        } else if (time <= gameRules().maxTimeNormalReply) {
            gameScore.increment(gameRules().pointsToAddNormalReplySuccess);

        } else {
            gameScore.increment(gameRules().pointsToAddSlowReplySuccess);
        }
    }

    function recalculateScoreIfFail(time) {
        if (time <= gameRules().maxTimeQuickReply) {
            gameScore.decrement(gameRules().pointsToSubtractQuickReplyFail);

        } else {
            gameScore.decrement(gameRules().pointsToSubtractNormalReplyFail);
        }
    }

    function recalculateScoreIfNoReply() {
        gameScore.decrement(gameRules().pointsToSubtractNoReply);
    }

    function allQuestionsCompleted() {
        questionTimer.stop();
        ui.allQuestionsCompletedState();
    }


    return {
        init,
        allQuestionsCompleted,//only for test??
        getQuestionNavigator,
    }
};
