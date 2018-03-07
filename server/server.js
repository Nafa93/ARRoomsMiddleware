
const express = require('express')
const google = require('googleapis')
const moment = require('moment')
const _ = require('lodash')
const bodyParser = require('body-parser')
const calendar = google.calendar({version: 'v3'})
const OAuth2 = google.auth.OAuth2

// var oauth2Client = new OAuth2()

var key = require('../jwt.keys.json')

var timeMin, timeMax

// process.env.client_email = key.client_email
// process.env.private_key = key.private_key

// var jwtClient = new google.auth.JWT(
//   process.env.client_email,
//   null,
//   JSON.parse(process.env.private_key),
//   ['https://www.googleapis.com/auth/calendar'], // an array of auth scopes
//   null
// )

var jwtClient = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ['https://www.googleapis.com/auth/calendar'], // an array of auth scopes
  null
)

var app = express()

app.use(bodyParser.json())

var port = process.env.PORT || 3001

app.post('/setToken', (req, res) => {
  // oauth2Client.setCredentials()
  console.log(req.body)
  const client = new OAuth2(req.body.clientId)
  async function verify () {
    const ticket = await client.verifyIdToken({
      idToken: req.body.userid,
      audience: req.body.clientId
      // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      // [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    })
    const payload = ticket.getPayload()
    const userid = payload['sub']
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
    console.log(payload)
    console.log(userid)
  }
  verify().catch(res.send(console.error))
})

app.get('/events/now/:calendarId', (req, res) => {
  timeMin = moment().second(0).format()
  timeMax = moment().second(1).format()

  var calendarId = req.params.calendarId

  jwtClient.authorize(function (err, tokens) {
    if (err) {
      console.log(err)
    } else {
      calendar.events.list(
        { calendarId,
          auth: jwtClient,
          timeMin,
          timeMax,
          singleEvents: true
        },
        function (err, response) {
          var customResponse = {
            items: response.items ? response.items : null,
            isFree: null,
            err
          }
          if (err) {
            res.status(400).send(customResponse)
          } else if (response.items.length > 0) {
            customResponse.isFree = false
            res.status(200).send(customResponse)
          } else {
            customResponse.isFree = true
            res.status(200).send(customResponse)
          }
        })
    }
  })
})

app.get('/events/today/:calendarId', (req, res) => {
  timeMin = moment().hour(0).minute(0).second(0).format()
  timeMax = moment().hour(23).minute(59).second(59).format()

  var calendarId = req.params.calendarId

  jwtClient.authorize(function (err, tokens) {
    if (err) {
      console.log(err)
    } else {
      calendar.events.list(
        { calendarId,
          auth: jwtClient,
          timeMin,
          timeMax,
          singleEvents: true
        },
        function (err, response) {
          var customResponse = {
            items: response.items ? response.items : null,
            message: '',
            err
          }
          if (err) {
            res.status(400).send(customResponse)
          } else if (response.items.length > 0) {
            customResponse.message = `There are ${response.items.length} events in this room`
            res.status(200).send(customResponse)
          } else {
            customResponse.message = 'There are no events today'
            res.status(200).send(customResponse)
          }
        })
    }
  })
})

app.listen(port, () => {
  if (port) {
    console.log(`Started up at port ${port}`)
  } else {
    console.log('The application started')
  }
})

module.exports = { app }
