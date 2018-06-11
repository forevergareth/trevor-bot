const request = require('superagent')

module.exports.process = (intentData, registry, callback) => {
  if (intentData.intent[0].value !== 'time')
    return callback(new Error(`Expected time intent, got : ${intentData.intent[0].value}`))
  
  if (!intentData.location)
    return callback(new Error(`Expected location in time intent.`))
  
  let location = intentData.location[0].value.replace(/,.trevor/i, '')

  const service = registry.get('time');
  if (!service)
    return cb(false, 'This feature is not avaliable right now');
  
  request.get(`http://${service.ip}:${service.port}/service/${location}`, (err, res) => {
    if (err || res.statusCode != 200 || !res.body.result) {
      console.log(err)
      console.log(res.body)
      
      return callback(false, `I had a problem getting the time in ${location}`)
    }

    return callback(false, `The time in ${location} is currently ${res.body.result}`)
  })
  
  
  
  //return callback(false, `I dont yet know the time in ${intentData.location[0].value}`)
  
}