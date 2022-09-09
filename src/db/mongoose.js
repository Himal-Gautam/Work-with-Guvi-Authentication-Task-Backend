import mongoose from 'mongoose'
import 'dotenv/config'
import chalk from 'chalk'

mongoose.connect( process.env.MONGO_URI, {
    useNewUrlParser: true, 
    useCreateIndex: true, 
    useUnifiedTopology: true }
).then(() => console.log(chalk.yellow.bold.underline('database connection established')))
.catch(err => console.log(err))