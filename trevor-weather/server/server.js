'use strict'
require('dotenv').config()
const app = require('express')()
const request = require('superagent');
const key = require('../config/keys').weather


//api.openweathermap.org/data/2.5/weather?lat=35&lon=139
app.get('/service/:location', (req, res, next) => {
  let loc = req.params.location  

  request.get(`http://api.openweathermap.org/data/2.5/weather?q=${loc}&APPID=${key}&units=metric`, 
  (err, response) => {

      if (err) {
          console.log(err);
          return res.sendStatus(404);
      }

      res.json({result: `${response.body.weather[0].description} at ${response.body.main.temp} degrees`});

  });
});


const httpserver = require('http').createServer(app)
httpserver.listen(3020)
httpserver.on('listening', ()=>{
  console.log(`Trevor: weather Listening on ${httpserver.address().port} in ${app.get('env')}`)

  const announce = () => {
    request.put(`http://127.0.0.1:3000/service/weather/${httpserver.address().port}`, (err, res) => {
        console.log(err);
        if(err) console.log("Error connecting to Trevor");
    });
  };
  announce();
  setInterval(announce, 15*1000);
})