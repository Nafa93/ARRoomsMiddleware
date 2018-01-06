
const express = require('express')
var google = require('googleapis')
var OAuth2 = google.auth.OAuth2
var readline = require('readline')

var clientSecret = 'A0JzbPxlHFJhdJ069IQgbcIM'
var clientId = '153639822975-ik5n1tlshg91mvuo4lqcuhhkm18asqn7.apps.googleusercontent.com'
var redirectUrl = 'http://localhost:8081'

var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl)

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function getAccessToken (oauth2Client, callback) {
  // generate consent page url
  var url = oauth2Client.generateAuthUrl({
    // access_type: 'online', // will return a refresh token
    scope: 'https://www.googleapis.com/auth/calendar' // can be a space-delimited string or an array of scopes
  })

  console.log('Visit the url: ', url)
  rl.question('Enter the code here:', function (code) {
    // request access token
    oauth2Client.getToken(code, function (err, tokens) {
      if (err) {
        return callback(err)
      }
      // set tokens to the client
      // TODO: tokens should be set by OAuth2 client.
      oauth2Client.credentials = tokens
      callback()
    })
  })
}

var calendar = google.calendar({version: 'v3'})

var app = express()

var port = 3001

app.get('/test', (req, res) => {
  getAccessToken(oauth2Client, function () {
    // retrieve user profile
    calendar.calendarList.get({ calendarId: encodeURIComponent('nicolasfernandez93@gmail.com'), auth: oauth2Client }, function (err, response) {
      if (err) {
        return console.log('An error occured', err)
      }
      console.log(response)
    })
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
