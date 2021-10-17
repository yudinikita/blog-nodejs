import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import path from 'path'
import fileUpload from 'express-fileupload'
import connectDB from './db'
import postRoute from './routes/posts'
import authRoute from './routes/auth'
import swaggerUi from 'swagger-ui-express'
import * as swaggerDocument from './swagger/openapi.json'

const dotenvParse = dotenv.config()
if (dotenvParse.error) {
  throw dotenvParse.error
}

const PORT = process.env.PORT || 5000

const app = express()

const staticDir = path.join(__dirname, 'public')
app.use(express.static(staticDir))

app.use(fileUpload({
  limits: {
    fileSize: 1000000
  },
  abortOnLimit: true,
  responseOnLimit: 'Файл слишком большой (не более 1 МБ)'
}))

app.use(cookieParser())
app.use(express.json())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use('/auth', authRoute)
app.use('/api/posts', postRoute)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.get('/', (request, response) => {
  response.send('Hello, World!')
})

const start = async (): Promise<void> => {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}...`)
      console.log(`Server ready at ${process.env.BASE_URL}:${PORT}`)
    })
  } catch (e) {
    console.log(`Server startup error: ${e.message}`)
    process.exit(1)
  }
}

start()
