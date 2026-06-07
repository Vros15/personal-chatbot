require('dotenv').config()
const express = require('express')
const Anthropic = require('@anthropic-ai/sdk')

const corsConfig = require('./middleware/corsConfig')
const rateLimiter = require('./middleware/rateLimiter')
const validateMessage = require('./middleware/validator')
const { checkMessage } = require('./utils/topicFilter')
const { checkBudget, updateSession, isFlagged } = require('./utils/tokenBudget')
const { SYSTEM_PROMPT } = require('./config/systemPrompt')

const app = express()
const PORT = process.env.PORT || 3001

// Initialize Anthropic client
const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
})

// ── Middleware Stack ──────────────────────────────────
app.use(express.json())   // parse JSON request bodies
app.use(corsConfig)       // Layer 1: CORS
app.use(rateLimiter)      // Layer 2: IP rate limiting

// ── Health Check ─────────────────────────────────────
app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
})

// ── Chat Endpoint ─────────────────────────────────────
app.post('/chat', validateMessage, async (req, res) => {
    const { message } = req.body
    const sessionId = req.headers['x-session-id']

    try {

        // Layer 3: Token & session budget check
        const budget = checkBudget(sessionId)
        if (!budget.allowed) {
            return res.status(429).json({ error: budget.reason })
        }

        // Layer 4: Bot detection — slow them down silently
        if (isFlagged(sessionId)) {
            await new Promise(resolve => setTimeout(resolve, 5000))
        }

        // Layer 5: Topic filter & injection detection
        const topicCheck = checkMessage(message)
        if (topicCheck.blocked) {
            return res.status(400).json({ error: topicCheck.message })
        }

        // ── Call Claude ───────────────────────────────
        const response = await client.messages.create({
            model: 'claude-haiku-4-5',
            max_tokens: 300,
            system: SYSTEM_PROMPT,
            messages: [{ role: 'user', content: message }]
        })

        const reply = response.content[0].text
        const tokensUsed = response.usage.input_tokens + response.usage.output_tokens

        // Update session with tokens used
        updateSession(sessionId, tokensUsed)

        // Return response + session info for frontend
        res.json({
            reply,
            usage: {
                tokensUsed,
                messagesRemaining: 15 - (budget.session.messageCount + 1)
            }
        })

    } catch (error) {
        console.error('Claude error:', error.message)
        res.status(500).json({ error: 'Something went wrong. Please try again.' })
    }
})

// ── Start Server ──────────────────────────────────────
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`Health check: http://localhost:${PORT}/health`)
})
