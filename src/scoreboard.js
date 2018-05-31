export default function scoreboard(){
    let score = 0;

    function getScore(){
        return score;
    }

    function increment(points){
        score += points;
    }

    return{
        getScore,
        increment,
    }
}