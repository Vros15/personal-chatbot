// Store session data in memory
// In production you'd use Redis — we'll talk about that later
const sessions = new Map()

const SESSION_TOKEN_LIMIT = 3000  // max tokens per session
const SESSION_MESSAGE_LIMIT = 15  // max messages per session
const BOT_DETECTION_SPEED_MS = 2000 // min ms between messages

const getSession = (sessionId) => {
    if (!sessions.has(sessionId)) {
        sessions.set(sessionId, {
            tokensUsed: 0,
            messageCount: 0,
            lastMessage: null,
            firstSeen: Date.now(),
            flagged: false
        })
    }
    return sessions.get(sessionId)
}

const checkBudget = (sessionId) => {
    const session = getSession(sessionId)
    const now = Date.now()

    // Bot detection — messages too fast
    if (session.lastMessage && (now - session.lastMessage) < BOT_DETECTION_SPEED_MS) {
        session.flagged = true
    }

    // Message count limit
    if (session.messageCount >= SESSION_MESSAGE_LIMIT) {
        return {
            allowed: false,
            reason: 'You have reached the message limit for this session. Thanks for chatting!'
        }
    }

    // Token limit
    if (session.tokensUsed >= SESSION_TOKEN_LIMIT) {
        return {
            allowed: false,
            reason: 'Session token limit reached. Thanks for chatting!'
        }
    }

    return { allowed: true, session }
}

const updateSession = (sessionId, tokensUsed) => {
    const session = getSession(sessionId)
    session.tokensUsed += tokensUsed
    session.messageCount++
    session.lastMessage = Date.now()
    sessions.set(sessionId, session)
}

const isFlagged = (sessionId) => {
    const session = getSession(sessionId)
    return session.flagged
}

module.exports = { checkBudget, updateSession, isFlagged }