'use strict'
const app = require('express')()


app.get('/service/:location', (req, res, next) => {
  res.body = req.params.location
})


const httpserver = require('http').createServer(app)
httpserver.listen(3010)
httpserver.on('listening', ()=>{
  console.log(`Trevor: time Listening on ${httpserver.address().port} in ${app.get('env')}`)
})