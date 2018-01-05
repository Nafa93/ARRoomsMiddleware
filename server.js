
const express = require('express')

var app = express()

var port = 3000

var response = {'response': 'its working'}

app.get('/test', (req, res) => {
  res.send(response.response)
})

app.listen(port, () => {
  if (port) {
    console.log(`Started up at port ${port}`)
  } else {
    console.log('The application started')
  }
})

module.exports = { app }
