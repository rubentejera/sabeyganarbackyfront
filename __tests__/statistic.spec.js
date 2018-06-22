import statistic from "../src/statistic";

describe("Statistic", function () {
    let statisticTest;

    beforeEach(function () {
        statisticTest = new statistic();
        addRandomDataToStatistic();
    });


    it("should return some data", function () {
        expect(statisticTest.getAllData()).not.toBe(null);
    });


    function addRandomDataToStatistic() {
        statisticTest.addData({
            idQuestion:1,
            isAnswered:true,
            idAnswerSelected:1,
            idCorrectAnswer:1,
            isCorrect:true,
            score: 3,
            elapsedSeconds:2,
        });
    }



});