const injectionPatterns = [
    'ignore previous',
    'ignore all',
    'forget instructions',
    'you are now',
    'act as',
    'pretend you are',
    'jailbreak',
    'do anything now',
    'dan mode',
    'override',
    'new persona',
    'disregard'
]

const offTopicPatterns = [
    'write me code',
    'write code',
    'build me',
    'make me a',
    'generate a',
    'write an essay',
    'do my homework',
    'solve this problem',
    'what is the weather',
    'stock price',
    'tell me a joke',
]

const checkMessage = (message) => {
    const lower = message.toLowerCase()

    // Check for prompt injection
    const isInjection = injectionPatterns.some(pattern =>
        lower.includes(pattern)
    )

    if (isInjection) {
        return {
            blocked: true,
            reason: 'injection',
            message: "Let's keep the conversation focused on Victor."
        }
    }

    // Check for off-topic abuse
    const isOffTopic = offTopicPatterns.some(pattern =>
        lower.includes(pattern)
    )

    if (isOffTopic) {
        return {
            blocked: true,
            reason: 'offtopic',
            message: "I'm only here to help you learn about Victor. Try asking about his skills or projects."
        }
    }

    return { blocked: false }
}

module.exports = { checkMessage }