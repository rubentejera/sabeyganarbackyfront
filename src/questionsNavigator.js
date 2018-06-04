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

    function getActualQuestion() {
        return questions[questionsIndex];
    }

    function getNextQuestion() {
        let question = questions[questionsIndex];
        goToNextQuestion();
        if (questionsIndex >= questions.length) {
            nonVisitedQuestions = false;
        }
        return question;
    }

    return {
        getActualQuestion,
        restartQuestions: restartQuestions,
        areThereNonVisitedQuestions,
        getNextQuestion: getNextQuestion
    };
};

