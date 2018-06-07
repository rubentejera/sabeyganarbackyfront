export default function gameRules() {
    let secondsPerQuestion = 12;
    const maxTimeQuickReply = 3;
    const maxTimeNormalReply = 10;

    const pointsQuickReplySuccess = 3;
    const pointsNormalReplySuccess = 2;
    const pointsSlowReplySuccess = 1;

    const pointsQuickReplyFail = -1;
    const pointsNormalReplyFail = -2;
    const pointsNoReply = -3;

    return {
        secondsPerQuestion,
        maxTimeNormalReply,
        maxTimeQuickReply,
        pointsQuickReplySuccess,
        pointsNormalReplySuccess,
        pointsSlowReplySuccess,
        pointsQuickReplyFail,
        pointsNormalReplyFail,
        pointsNoReply
    }
}