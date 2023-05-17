require('dotenv').config()
require('express-async-errors')
//express
const express= require('express')
const app= express()
//Rest of packages
const morgan= require('morgan')
const cookieParser= require('cookie-parser')
const rateLimiter= require('express-rate-limit')
const helmet= require('helmet')
const xss= require('xss-clean')
const cors= require('cors')
const mongoSanitize= require('express-mongo-sanitize')
//Database
const connectDB=  require('./db/connect')
//Routes
const authRouter= require('./routes/authRoutes')
const userRouter= require('./routes/userRoutes')
const movieRouter= require('./routes/movieRoutes')
const cartRouter= require('./routes/cartRoutes')
const orderRouter= require('./routes/orderRoutes')
const reviewRouter= require('./routes/reviewRoutes')
//Middleware
const notFoundMiddleware= require('./middleware/not-found')
const errorHandlerMiddleware= require('./middleware/error-handler')

app.use(morgan('tiny'))

app.set('trust proxy',1)
app.use(rateLimiter({
    windowsMs: 15 * 60 * 1000,
    max:60
}))
app.use(helmet())
app.use(cors())
app.use(xss())
app.use(mongoSanitize())

app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))

app.get('/', (req,res)=>{
    res.send('BOOKSTORE APP')
})

app.use('/api/v1/auth',authRouter)
app.use('/api/v1/users',userRouter)
app.use('/api/v1/movies',movieRouter)
app.use('/api/v1/carts',cartRouter)
app.use('/api/v1/orders',orderRouter)
app.use('/api/v1/reviews',reviewRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)


const port= process.env.PORT || 5000

const start= async()=>{
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(port, console.log(`Listening on port ${port}`))
    } catch (error) {
        console.log(error)
    }
}
start()