
const express = require('express')

var app = express()

var port = 3000

app.get('/test', (req, res) => {
  res.send("It's working!")
})

app.listen(port, () => {
  if (port) {
    console.log(`Started up at port ${port}`)
  } else {
    console.log('The application started')
  }
})

module.exports = { app }
