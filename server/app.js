import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'

import userRoutes from './routes/userRoutes.js'
import ItemRoutes from './routes/ItemRoutes.js'

dotenv.config();

const app = express()

// CORS must come BEFORE routes
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'token'],
    credentials: true,
}))

app.use(express.json())
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

// Explicit CORS headers (belt-and-suspenders for the presentation)
app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, token')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
    if (_req.method === 'OPTIONS') {
        return res.sendStatus(200)
    }
    next()
})

app.use('/users', userRoutes)
app.use('/Items', ItemRoutes)
// Also mount on lowercase so frontend /items calls work
app.use('/items', ItemRoutes)

const port = process.env.PORT || 5000;
const db = process.env.DB;
const secret = process.env.SECRET_KEY || process.env.JWT_SECRET;

if (!db) {
    console.error('ERROR: DB environment variable is not set. Check your .env file.');
    process.exit(1);
}

mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(port, () => console.log('✅ DB connected — server running on PORT: ' + port)))
    .catch((err) => console.log('❌ DB connection error:', err.message));
