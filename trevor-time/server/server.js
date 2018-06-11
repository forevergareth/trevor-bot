'use strict'
const app = require('express')()
const keys = require('../config/keys')
const request = require('superagent')
const moment = require('moment')


//https://maps.googleapis.com/maps/api/timezone/json?location=${loc.lat},${loc.lngt}&timestamp=${timestamp}&key=${keys.google}
app.get('/service/:location', (req, res, next) => {
  let loc = req.params.location

  request.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${loc}&key=${keys.google}`, (err, response) => {
    if (err) {
      console.log(err)
      return res.sendStatus(500)
    }
    let geoLoc = response.body.results[0].geometry.location
    let timestamp = +moment().format('X')

    request.get(`https://maps.googleapis.com/maps/api/timezone/json?location=${geoLoc.lat},${geoLoc.lng}&timestamp=${timestamp}&key=${keys.google}`, (err, response) => {
      if (err) {
        console.log(err)
        return res.sendStatus(500)
      }
      let result = response.body

      let time = moment.unix(timestamp + result.dstOffset + result.rawOffset).utc().format('dddd, MMMM Do YYYY, h:mm:ss a')

      res.json({result: time})
    })
  })


})

require('dotenv').config()
const httpserver = require('http').createServer(app)
httpserver.listen(3010)
httpserver.on('listening', () => {
  console.log(`Trevor: time Listening on ${httpserver.address().port} in ${app.get('env')}`)

  const announce = () => {
    request.put(`http://127.0.0.1:3000/service/time/${httpserver.address().port}`, (err, res) => {
        console.log(err);
        if(err) console.log("Error connecting to Trevor");
    });
  };
  announce();
  setInterval(announce, 15*1000);
})