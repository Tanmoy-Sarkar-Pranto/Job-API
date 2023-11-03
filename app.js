require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const connectDB = require('./db/connect')
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')

const authenticateUser = require('./middleware/authentication')
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
// extra packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

//swagger
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')

app.set('trust proxy',1)
app.use(rateLimiter({
  windowMs: 15*60*1000, // 15 minutes
  max: 100 //limit eact IP to 100 requests per windowMs
}))
app.use(helmet())
app.use(cors())
app.use(xss())

// routes
app.get('/',(req,res)=>{
  res.send('<h1><a href="/api-docs">Jobs API</a></h1>')
})

app.use('/api-docs',swaggerUI.serve, swaggerUI.setup(swaggerDocument))

app.use('/api/v1/auth',errorHandlerMiddleware,authRouter)
app.use('/api/v1/jobs',authenticateUser,jobsRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    console.log("Connected to db")
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
