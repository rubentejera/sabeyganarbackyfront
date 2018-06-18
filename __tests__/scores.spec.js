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
        expect(scoresTest.getScores()).toBe(scoresOrderedByScore);
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
    ]

    let sortByProperty = function (property) {
        return function (x, y) {
            return ((x[property] === y[property]) ? 0 : ((x[property] > y[property]) ? 1 : -1));
        };
    };

});