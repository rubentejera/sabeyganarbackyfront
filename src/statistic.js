export default function statistic() {
    let data = [];


    function restart(){
        data = [];
    }

    function getAllData() {
        return data;
    }

    function addData(newData){
        data.push(newData);
    }

    return {
        addData,
        getAllData,
        restart,
    }
}