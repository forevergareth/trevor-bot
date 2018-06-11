'use strict'
require('dotenv').config()
const slackClient = require('../src/slack')
const app = require('express')()
const httpserver = require('http').createServer(app)
const ServiceRegistry = require('./serviceRegistry')
const serviceRegistry = new ServiceRegistry()


// Setup Wit NLP
const config = require('../config/wit')
const token = process.env.WIT_TOKEN || config.witConfig.key
const wit = require('../src/wit')(token)



let rtm = slackClient.init(wit,serviceRegistry)
rtm.start();

app.put('/service/:intent/:port', (req, res, next) => {
  const serviceIntent = req.params.intent;
  const servicePort = req.params.port;

  const serviceIp = req.connection.remoteAddress.includes('::')
  ? `[${req.connection.remoteAddress}]` : req.connection.remoteAddress;

  serviceRegistry.add(serviceIntent, serviceIp, servicePort);
  res.json({result: `${serviceIntent} at ${serviceIp}:${servicePort}`});
});


// start server if we have connection
slackClient.registerAuthHandler(rtm, ()=>httpserver.listen(3000))



httpserver.on('listening', ()=>{
  console.log(`Listening on ${httpserver.address().port} in ${app.get('env')}`)
})