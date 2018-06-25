export default function ranking() {
    let ranking = [];

    function getRanking() {
        return ranking;
    }

    function addScore(name, score){
        ranking.push({name,score});
        ranking = ranking.sort(sortFromHighestToLowestByProperty('score'));
    }


    let sortFromHighestToLowestByProperty = function (property) {
        return function (x, y) {
            return ((x[property] === y[property]) ? 0 : ((x[property] < y[property]) ? 1 : -1));
        };
    };

    return {
        getRanking,
        addScore,
    }
}