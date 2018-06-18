import scores from "../src/scores";

describe("Scores", function () {
    let scoresTest;

    beforeEach(function () {
        scoresTest = new scores();
        addRandomScores();
    });


    it("should return some scores", function () {
        expect(scoresTest.getScores()).not.toBe(null);
    });


    function addRandomScores() {
        scoreTest.addScore({
            name: "Pepe",
            score: 10
        });

        scoreTest.addScore({
            name: "Juan",
            score: 9
        });

        scoresTest.addScore({
            name: "Maria",
            score: 13
        });
    }

});