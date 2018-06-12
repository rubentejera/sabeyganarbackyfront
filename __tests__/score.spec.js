import score from "../src/score";

describe("Score", function () {
    let scoreTest;

    beforeEach(function () {
        scoreTest = new score();
    });

    it("should return 0 when score is started", function () {
        expect(scoreTest.getScore()).toEqual(0);
    });

    it("should increment a quantity to the score", function () {
        scoreTest.increment(3);
        expect(scoreTest.getScore()).toEqual(3);
    });

    it("should decrement a quantity to the score", function () {
        scoreTest.increment(3);
        scoreTest.decrement(2);
        expect(scoreTest.getScore()).toEqual(1);
    });

    it("should be 0 the minimum score", function () {
        scoreTest.decrement(2);
        expect(scoreTest.getScore()).toEqual(0);
    });

});