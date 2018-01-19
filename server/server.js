
const express = require('express')
const google = require('googleapis')
const moment = require('moment')
const calendar = google.calendar({version: 'v3'})
var key = require('../jwt.keys.json')
var todayStart = moment().hour(0).minute(0).second(0).format()
var todayEnd = moment().hour(23).minute(59).second(59).format()

var jwtClient = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ['https://www.googleapis.com/auth/calendar'], // an array of auth scopes
  null
)

var app = express()

var port = 3001

app.get('/events/today/:calendarId', (req, res) => {
  var _calendarId = req.params.calendarId

  jwtClient.authorize(function (err, tokens) {
    if (err) {
      console.log(err)
    } else {
      calendar.events.list(
        { calendarId: _calendarId,
          auth: jwtClient,
          timeMin: todayStart,
          timeMax: todayEnd,
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
