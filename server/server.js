const express = require('express')
const google = require('googleapis')
const {getAccessToken, oauth2Client, url} = require('./google/authentication')

var calendar = google.calendar({version: 'v3'})

var app = express()

var port = 3001

app.get('/test', (req, res) => {
  getAccessToken(oauth2Client, function () {
    // retrieve user profile
    calendar.events.list({ calendarId: encodeURIComponent('namorosino@solstice.com'), auth: oauth2Client }, function (err, response) {
      if (err) {
        return console.log('An error occured', err)
      }
      console.log(response)
    })
  })
})

app.get('/authUrl', (req, res) => {
  res.send(url)
})

app.listen(port, () => {
  if (port) {
    console.log(`Started up at port ${port}`)
  } else {
    console.log('The application started')
  }
})

module.exports = { app }
