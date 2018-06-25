import timer from './timer.js';
import gameUI from './gameUI.js';
import score from './score.js';
import ranking from './ranking.js';
import statistic from './statistic.js';
import gameRules from './gameRules.js';

export default function createGame(createQuestionsNavigator, serverQuestions) {

    let theQuestionNavigator;
    let secondsPerQuestion = gameRules().secondsPerQuestion;
    let questionTimer = new timer(secondsPerQuestion, handlerEventTime);
    let gameScore = new score();
    let gameRanking = new ranking();
    let gameStatistic = new statistic();
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
            handlerEventOnFinishQuestionTimer();
        }
    }


    function handlerEventOnEnterName(name) {
        gameRanking.addScore(name, gameScore.getScore());
        //TODO Add Save Statistic with Name --> gameStatistic.save(name)
        ui.gameOverState(gameRanking.getRanking(), gameStatistic.getStatistic());
    }

    function handlerEventOnStartGame() {
        theQuestionNavigator.restartQuestions();
        ui.startGameState(theQuestionNavigator.getCurrentQuestion());
        questionTimer.restart();
        gameScore.restart();
        gameStatistic.restart();
        updateUIScore();
    }

    function handlerEventOnNextQuestion() {
        let currentQuestion = theQuestionNavigator.getCurrentQuestion();
        let selectedAnswer = ui.getSelectedAnswer();
        let currentTimer = getTimeElapsed();

        if (selectedAnswer) {
            if (isAnswerCorrect(currentQuestion, selectedAnswer)) {
                recalculateScoreIfSuccess(currentTimer);
            } else {
                recalculateScoreIfFail(currentTimer);
            }

            updateStatistic(currentQuestion, selectedAnswer, currentTimer);
            goToNextQuestion();
        } else {
            console.log("Debe elegir una opcion para que pase algo...");
        }
    }

    function handlerEventOnFinishQuestionTimer() {
        let currentQuestion = theQuestionNavigator.getCurrentQuestion();
        let selectedAnswer = ui.getSelectedAnswer();
        let currentTimer = getTimeElapsed();

        recalculateScoreIfFinishTimer();
        updateStatistic(currentQuestion, selectedAnswer, currentTimer);
        goToNextQuestion();
    }


    function updateStatistic(currentQuestion, selectedAnswer, currentTimer) {
        let newInputToAddOnStatistic = {};
        newInputToAddOnStatistic['idQuestion'] = currentQuestion.id;
        newInputToAddOnStatistic['idCorrectAnswer'] = currentQuestion.correctAnswer.id;

        if (selectedAnswer) {
            newInputToAddOnStatistic['isAnswered'] = true;
            newInputToAddOnStatistic['isCorrect'] = isAnswerCorrect(currentQuestion, selectedAnswer);
            newInputToAddOnStatistic['idAnswerSelected'] = parseInt(selectedAnswer.id);
        } else {
            newInputToAddOnStatistic['isAnswered'] = false;
        }

        newInputToAddOnStatistic['elapsedSeconds'] = currentTimer;

        gameStatistic.addData(newInputToAddOnStatistic);
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

    function recalculateScoreIfFinishTimer() {
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
