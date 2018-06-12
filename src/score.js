export default function score() {
    let actualScore = 0;

    function getScore() {
        return actualScore;
    }

    function increment(points) {
        actualScore += points;
    }

    function decrement(points) {
        if (actualScore - points < 0) {
            actualScore = 0;
        } else {
            actualScore -= points;
        }
    }

    function restart() {
        actualScore = 0;
    }

    return {
        getScore,
        increment,
        decrement,
        restart,
    }
}