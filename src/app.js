const { EGRESS_URLS, INGRESS_HOST, INGRESS_PORT, MODULE_NAME } = require('./config/config.js')
const fetch = require('node-fetch')
const express = require('express')
const app = express()
const winston = require('winston')
const expressWinston = require('express-winston')
const { decode } = require('./utils/decoder')
const { formatPayload, send } = require('./utils/util')
const fs = require('fs')

//initialization
app.use(express.urlencoded({ extended: true }))
app.use(
  express.json({
    verify: (req, res, buf, encoding) => {
      try {
        JSON.parse(buf)
      } catch (e) {
        res.status(400).json({ status: false, message: 'Invalid payload provided.' })
      }
    },
  })
)

//logger
app.use(
  expressWinston.logger({
    transports: [
      new winston.transports.Console(),
      /*
    new winston.transports.File({
        filename: 'logs/decoder.log'
    })
    */
    ],
    format: winston.format.combine(winston.format.colorize(), winston.format.json()),
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: 'HTTP {{req.method}} {{req.url}}', // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function (req, res) {
      return false
    }, // optional: allows to skip some log messages based on request and/or response
  })
)
//main post listener
app.post('/', async (req, res) => {
  let json = req.body
  //for some reason melita is sending JSON structure from payload, and not payload property
  // so to be sure, we will support both
  if (!json) {
    return res.status(400).json({ status: false, message: 'Payload not provided.' })
  }
  input_json = {}
  if (typeof json.payload === 'undefined') {
    input_json = json
  } else {
    input_json = json.payload
  }
  if (typeof input_json.data === 'undefined') {
    return res.status(500).json({ status: false, message: `Error processing payload: ${input_json}` })
  }
  // parse data property, and update it
  input_json.data = decode(input_json.fPort, Buffer.from(input_json.data, 'base64').toString('hex'))
  // decode deviceEUI
  input_json.devEUI = Buffer.from(input_json.devEUI, 'base64').toString('hex')
  const output_payload = formatPayload(input_json)
  await send(output_payload)
  if (EGRESS_URLS) {
    await send(output_payload)
    return res.status(200).json({ status: true, message: 'Payload processed' })
  } else {
    return res.status(200).json(output_payload)
  }
})

//handle exceptions
app.use(async (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  let errCode = err.status || 401
  res.status(errCode).send({
    status: false,
    message: err.message,
  })
})

if (require.main === module) {
  app.listen(INGRESS_PORT, INGRESS_HOST, () => {
    console.log(`${MODULE_NAME} listening on ${INGRESS_PORT}`)
  })
}
