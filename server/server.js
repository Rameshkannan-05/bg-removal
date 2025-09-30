import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './configs/mongodb.js'
import userRouter from './routes/userRoutes.js'
import imageRouter from './routes/imageRoutes.js'

// App Config
const PORT = process.env.PORT || 4000
const app = express()
// connecting DB
await connectDB()

// Initialize Middlewares
app.use(express.json())    // whenever we get request on this server then it will be parsed using the json method
app.use(cors())            // Connect client that is running on different PORTs to the backend server


// API routes
app.get('/',(req,res)=> res.send('API is working'))
app.use('/api/user',userRouter)
app.use('/api/image',imageRouter)

app.listen(PORT,()=>console.log('Server Running on port '+PORT))