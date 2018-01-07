var google = require('googleapis')
var OAuth2 = google.auth.OAuth2

var clientSecret = 'A0JzbPxlHFJhdJ069IQgbcIM'
var clientId = '153639822975-ik5n1tlshg91mvuo4lqcuhhkm18asqn7.apps.googleusercontent.com'
var redirectUrl = 'http://localhost:8081'

const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl)

var url = oauth2Client.generateAuthUrl({
  access_type: 'online', // will return a refresh token
  scope: 'https://www.googleapis.com/auth/calendar' // can be a space-delimited string or an array of scopes
})

function getAccessToken (oauth2Client, callback) {
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

const Authentication = {getAccessToken, oauth2Client, url}

module.exports = {Authentication}
