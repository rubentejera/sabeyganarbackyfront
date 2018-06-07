export default function gameRules() {
    let secondsPerQuestion = 12;
    const maxTimeQuickReply = 3;
    const maxTimeNormalReply = 10;

    const pointsToAddQuickReplySuccess = 3;
    const pointsToAddNormalReplySuccess = 2;
    const pointsToAddSlowReplySuccess = 1;

    const pointsToSubtractNoReply = 3;
    const pointsToSubtractNormalReplyFail = 2;
    const pointsToSubtractQuickReplyFail = 1;

    return {
        secondsPerQuestion,
        maxTimeNormalReply,
        maxTimeQuickReply,
        pointsToAddQuickReplySuccess,
        pointsToAddNormalReplySuccess,
        pointsToAddSlowReplySuccess,
        pointsToSubtractQuickReplyFail,
        pointsToSubtractNormalReplyFail,
        pointsToSubtractNoReply
    }
}