const validateMessage = (req, res, next) => {
    const { message } = req.body
    const sessionId = req.headers['x-session-id']

    // Check session ID exists
    if (!sessionId || typeof sessionId !== 'string') {
        return res.status(400).json({ error: 'Invalid session.' })
    }

    // Check message exists
    if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required.' })
    }

    // Check message length — controls token cost
    if (message.trim().length === 0) {
        return res.status(400).json({ error: 'Message cannot be empty.' })
    }

    if (message.length > 500) {
        return res.status(400).json({ error: 'Message too long. Max 500 characters.' })
    }

    // Sanitize — trim whitespace
    req.body.message = message.trim()

    next() // passed all checks — move to next middleware
}

module.exports = validateMessage