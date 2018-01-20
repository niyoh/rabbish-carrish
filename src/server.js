import bluebird from 'bluebird'
import express from 'express'

import { uncaughtExceptionHandler, onPossiblyUnhandledRejectionHandler } from './modules/errors'

process.on('uncaughtException', uncaughtExceptionHandler)
bluebird.onPossiblyUnhandledRejection(onPossiblyUnhandledRejectionHandler)

import './modules/load'
import router from './modules/controllers'

const app = express()

app.set('view engine', 'html')
app.use(router)

const port = process.env.PORT || 3000
const server = app.listen(port, () => console.log(`Service is now running on port ${port}`))

export default server
