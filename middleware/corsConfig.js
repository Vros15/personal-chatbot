const cors = require('cors')

const corsOptions = {
    origin: 'https://www.roscreations.com',
    methods: ['POST'],
    allowedHeaders: ['Content-Type', 'X-Session-ID']
}

module.exports = cors(corsOptions)