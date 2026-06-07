const cors = require('cors')

const corsOptions = {
    origin: 'http://localhost:5173', // React dev server — we'll update this to your live URL when deploying
    methods: ['POST'],
    allowedHeaders: ['Content-Type', 'X-Session-ID']
}

module.exports = cors(corsOptions)