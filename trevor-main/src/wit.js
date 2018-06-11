'use strict'

const request = require('superagent')

function onResponse(res) {
  return res.entities
}

module.exports = (token) => {
  const ask = function (message, callback) {

    request.get('https://api.wit.ai/message')
      .set('Authorization', `Bearer ${token}`)
      .query({ v: '20180611' })
      .query({ q: message })
      .end((err, res) => {
        if (err) {
          callback(err)
        }
        if (res.statusCode !== 200) {
          return callback(`Expected 200 but got ${res.statusCode}`)
        }
        const witResponse = onResponse(res.body)
        return callback(null, witResponse)
      })
    
    // For Debugging
    console.log(`Ask : ${message}`)
    console.log(`Token : ${token}`)
  }

  return {ask}
}