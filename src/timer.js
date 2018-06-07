export default function timer(seconds, event) {
    let saveSeconds = seconds;
    let counter = 0;
    let interval;

    function start() {
        interval = setInterval(function () {
            intervalAction();
        }, 1000);
    }

    function intervalAction() {
        decrease();
        event(counter);
    }

    function stop() {
        clearInterval(interval);
    }

    function reset() {
        counter = saveSeconds;
    }

    function decrease() {
        counter--;
    }

    function get() {
        return counter;
    }

    function restart() {
        stop();
        reset();
        start();
        event(counter);
    }

    return {
        restart,
        get,
        stop,
    }
}