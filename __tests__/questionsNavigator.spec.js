import createQuestionsNavigator from '../src/questionsNavigator';
import testQuestions from '../src/testQuestions';



describe("the testQuestions navigator", () => {
    let questions = testQuestions().getQuestions();
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
            if (i === 0) {
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
            if (i === 0) {
                currentQuestion = questionsNavigator.getCurrentQuestion();
            } else {
                currentQuestion = questionsNavigator.getNextQuestion();
            }
            expect(currentQuestion).not.toEqual(lastQuestionVisited);
            lastQuestionVisited = currentQuestion;
        }
    });

    it("knows when the testQuestions are all visited", () => {
        for (let i = 0; i < totalQuestions; i++) {
            if (i === 0) {
                questionsNavigator.getCurrentQuestion();
            } else {
                questionsNavigator.getNextQuestion();
            }
        }
        expect(questionsNavigator.areThereNonVisitedQuestions()).toBeFalsy();
    });
});