import statistic from "../src/statistic";
import gameRules from "../src/gameRules";

describe("Statistic", function () {
    let statisticTest;

    beforeEach(function () {
        statisticTest = new statistic();
        addRandomDataToStatistic();
    });


    it("should return some data", function () {
        expect(statisticTest.getAllData()).not.toBe(null);
    });


    it("should not return any data", function () {
        statisticTest.restart();
        expect(statisticTest.getAllData()).toEqual([]);
    });

    it("should return number of success answers", function () {
        // expect(statisticTest.getSuccessAnswers()).toEqual(3);
        expect(statisticTest.getStatistic().successAnswer).toEqual(3);
    });


    function addRandomDataToStatistic() {
        statisticTest.addData({
            idQuestion:1,
            idCorrectAnswer:1,
            isAnswered:true,
            idAnswerSelected:1,
            isCorrect:true,
            score: gameRules().pointsToAddQuickReplySuccess,
            elapsedSeconds:gameRules().maxTimeQuickReply,
        });

        statisticTest.addData({
            idQuestion:2,
            idCorrectAnswer:3,
            isAnswered:true,
            idAnswerSelected:3,
            isCorrect:true,
            score: gameRules().pointsToAddNormalReplySuccess,
            elapsedSeconds:gameRules().maxTimeNormalReply,
        });

        statisticTest.addData({
            idQuestion:3,
            idCorrectAnswer:3,
            isAnswered:true,
            idAnswerSelected:3,
            isCorrect:true,
            score: gameRules().pointsToAddSlowReplySuccess,
            elapsedSeconds:gameRules().secondsPerQuestion,
        });

        statisticTest.addData({
            idQuestion:4,
            idCorrectAnswer:3,
            isAnswered:true,
            idAnswerSelected:2,
            isCorrect:false,
            score: gameRules().pointsToSubtractQuickReplyFail,
            elapsedSeconds:gameRules().maxTimeQuickReply,
        });

        statisticTest.addData({
            idQuestion:5,
            idCorrectAnswer:3,
            isAnswered:true,
            idAnswerSelected:2,
            isCorrect:false,
            score: gameRules().pointsToSubtractNormalReplyFail,
            elapsedSeconds:gameRules().maxTimeNormalReply,
        });

        statisticTest.addData({
            idQuestion:6,
            idCorrectAnswer:2,
            isAnswered:false,
            score: gameRules().pointsToSubtractNoReply,
            elapsedSeconds:gameRules().secondsPerQuestion,
        });
    }



});