export default function scoreboard() {
    let score = 0;

    function getScore() {
        return score;
    }

    function increment(points) {
        score += points;
    }

    function decrement(points) {
        if (score - points < 0) {
            score = 0;
        } else {
            score -= points;
        }
    }

    function restart() {
        score = 0;
    }

    return {
        getScore,
        increment,
        decrement,
        restart,
    }
}