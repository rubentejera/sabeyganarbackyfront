export default function createQuestionsNavigator(questions) {
    let questionsIndex = 0;
    let nonVisitedQuestions = true;

    function areThereNonVisitedQuestions() {
        return nonVisitedQuestions;
    }

    function restartQuestions() {
        questionsIndex = 0;
        nonVisitedQuestions = true;
    }

    function goToNextQuestion() {
        questionsIndex++;
    }

    function getCurrentQuestion() {
        isTheLastQuestion();
        return questions[questionsIndex];
    }

    function getNextQuestion() {
        if (areThereNonVisitedQuestions()) {
            goToNextQuestion();
        }
        return getCurrentQuestion()
    }

    function isTheLastQuestion() {
        if (questionsIndex >= questions.length - 1) {
            nonVisitedQuestions = false;
        }
    }

    return {
        getCurrentQuestion,
        restartQuestions: restartQuestions,
        areThereNonVisitedQuestions,
        getNextQuestion: getNextQuestion
    };
};

