const { RTMClient } = require('@slack/client')
const config = require('../config/slack')
const token = process.env.SLACK_TOKEN || config.slackConfig.key
let nlp = null
let rtm = null
let registry = null;

// TODO: Make Handler facade to collect all handlers

function onAuth(data) {
  console.log(`Logged in as ${data.self.name} of team ${data.team.name}`)
}

function onMessage(message) {

  if (message.text.toLowerCase().includes('trevor')) {
    nlp.ask(message.text, (err, res) => {
      if (err) {
        console.log(err)
        return
      }


      try {
        if(!res.intent || !res.intent[0] || !res.intent[0].value) {
            throw new Error("Could not extract intent.")
        }

        const intent = require('./intents/trevor-' + res.intent[0].value);

        intent.process(res, registry, function(error, response) {
            if(error) {
                console.log(error.message);
                return;
            }
            
            return rtm.sendMessage(response, message.channel);
        })

    } catch(err) {
        console.log(err);
        console.log(res);
        rtm.sendMessage("Sorry, I don't know what you are talking about!", message.channel);
    }
     
    })
  }
  
  console.log(`(channel:${message.channel}) ${message.user} says: ${message.text}`);
}

function registerAuthHandler(rtm, func) {
  rtm.on('authenticated', func);
}


module.exports.init = (wit, serviceRegistry) => {
  rtm = new RTMClient(token, { logLevel: 'debug' })
  nlp = wit
  registry = serviceRegistry;
  registerAuthHandler(rtm, onAuth)
  
  rtm.on('message', onMessage);
  return rtm
}

module.exports.registerAuthHandler = registerAuthHandler