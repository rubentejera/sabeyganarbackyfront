import ranking from "../src/ranking";

describe("Ranking", function () {
    let rankingTest;

    beforeEach(function () {
        rankingTest = new ranking();
        addRandomScoresToRanking();
    });


    it("should return some scores", function () {
        expect(rankingTest.getRanking()).not.toBe(null);
    });

    it("should return some scores ordered", function () {
        expect(rankingTest.getRanking()).toEqual(rankingOrderedByScore);
    });


    function addRandomScoresToRanking() {
        // rankingTest.addScore({
        //     name: "Pepe",
        //     score: 10
        // });
        //
        // rankingTest.addScore({
        //     name: "Juan",
        //     score: 9
        // });
        //
        // rankingTest.addScore({
        //     name: "Maria",
        //     score: 13
        // });
        rankingTest.addScore("Pepe",10);
        rankingTest.addScore("Juan",9);
        rankingTest.addScore("Maria",13);
    }

    let rankingOrderedByScore = [
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