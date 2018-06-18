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

    it("should return some scores ordered", function () {
        expect(scoresTest.getScores()).toEqual(scoresOrderedByScore);
    });


    function addRandomScores() {
        scoresTest.addScore({
            name: "Pepe",
            score: 10
        });

        scoresTest.addScore({
            name: "Juan",
            score: 9
        });

        scoresTest.addScore({
            name: "Maria",
            score: 13
        });
    }

    let scoresOrderedByScore = [
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

});