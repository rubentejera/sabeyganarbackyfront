export default function gameUI() {
    let clockUI = document.querySelector('.clock');

    function updateTimer(timer) {
        clockUI.innerHTML = timer;
    }


    return {
        updateTimer,
    }
}