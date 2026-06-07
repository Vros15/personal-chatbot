const rateLimit = require('express-rate-limit')

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minute window
    max: 20,                   // max 20 requests per IP per window
    standardHeaders: true,     // sends rate limit info in response headers
    legacyHeaders: false,
    message: {
        error: 'Too many requests from this IP. Please wait 15 minutes.'
    }
})

module.exports = rateLimiter