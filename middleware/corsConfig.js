const cors = require('cors')

const corsOptions = {
    origin: 'https://www.roscreations.com',, // React dev server — we'll update this to your live URL when deploying
    methods: ['POST'],
    allowedHeaders: ['Content-Type', 'X-Session-ID']
}

module.exports = cors(corsOptions)