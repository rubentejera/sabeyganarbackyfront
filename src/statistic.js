export default function statistic() {
    let allData = [];

    function restart() {
        allData = [];
    }

    function getAllData() {
        return allData;
    }

    function addData(newData) {
        allData.push(newData);
    }


    function getStatistic() {

        let successAnswer = 0;
        let failAnswer = 0;
        let noReply = 0
        let totalTime = 0;

        allData.forEach(data => {

            if (data.isAnswered) {
                if (data.isCorrect) {
                    successAnswer++;
                } else {
                    failAnswer++;
                }
            } else {
                noReply++;
            }

            totalTime += data.elapsedSeconds;
        });

        let numberOfQuestion = allData.length;

        let percentSuccessAnswer = (successAnswer * 100) / numberOfQuestion;
        let percentFailAnswer = (failAnswer * 100) / numberOfQuestion;
        let percentNoReply = (noReply * 100) / numberOfQuestion;

        let avgTimePerQuestion = totalTime / numberOfQuestion;


        return {
            successAnswer: successAnswer,
            percentSuccessAnswer: percentSuccessAnswer,
            failAnswer: failAnswer,
            percentFailAnswer: percentFailAnswer,
            noReply: noReply,
            percentNoReply: percentNoReply,
            averageTimePerQuestion: avgTimePerQuestion,
            totalTime: totalTime
        }
    }

    return {
        getAllData,//TODO only for test?
        addData,
        restart,
        getStatistic,
    }
}