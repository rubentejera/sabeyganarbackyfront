export default function scores() {
    let scores = [];

    function getScores() {
        return scores;
    }

    function addScore(score){
        scores.push(score);
        scores = scores.sort(sortFromHighestToLowestByProperty('score'));
    }


    let sortFromHighestToLowestByProperty = function (property) {
        return function (x, y) {
            return ((x[property] === y[property]) ? 0 : ((x[property] < y[property]) ? 1 : -1));
        };
    };

    return {
        getScores,
        addScore,
    }
}