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
        // isTheLastQuestion();
        return getCurrentQuestion()
        // let question = questions[questionsIndex];
        // if (questionsIndex >= questions.length) {
        //     nonVisitedQuestions = false;
        // }
        // return question;
    }

    function isTheLastQuestion(){
        if (questionsIndex >= questions.length-1) {
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

