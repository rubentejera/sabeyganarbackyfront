export default function statistic() {
    let allData = [];

    let statistic;


    function restart() {
        allData = [];
    }

    function getAllData() {
        return allData;
    }

    function addData(newData) {
        allData.push(newData);
    }


    function analyzeData() {
        let successAnswer = 0;

        allData.forEach(data => {
            if (data.isCorrect) {
                successAnswer++;
            }
            //TODO Resto de comprobaciones
        });

        statistic = {
            successAnswer: successAnswer,
        }
    }


    function getSuccessAnswers() {
        if(statistic == null){
            analyzeData();
        }
        return statistic.successAnswer;
    }

    return {
        addData,
        getAllData,
        restart,
        getSuccessAnswers,
    }
}