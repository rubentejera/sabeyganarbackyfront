export default function scoreboard(){
    let score = 0;

    function getScore(){
        return score;
    }

    return{
        getScore,
    }
}