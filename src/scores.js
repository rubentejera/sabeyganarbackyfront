export default function score() {
    let scores = [];

    function getScores() {
        return scores;
    }

    function addScore(score){
        scores.push(score);
    }

    return {
        getScores,
        addScore,
    }
}