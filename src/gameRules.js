export default function gameRules() {
    let secondsPerQuestion = 10;
    const maxTimeQuickReply = 3;
    const maxTimeNormalReply = 10;

    const pointsQuickReply = 3;
    const pointsNormalReply = 2;
    const pointsSlowReply = 1;

    return {
        secondsPerQuestion,
        maxTimeNormalReply,
        maxTimeQuickReply,
        pointsQuickReply,
        pointsNormalReply,
        pointsSlowReply,
    }
}