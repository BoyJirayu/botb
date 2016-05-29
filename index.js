var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var request = require('request')
var token = 'EAADIsq1dfVMBAFmawgoY6Ru51HcTh7NlpE8Y4ZA5EVpMC9htKSOe0z5Oc1199mHPJLPYvuyU4Fte0rggoRhFZClxQMOD4i0RLZCN4jqMiRofrZCrx5JezdsDFwNtRzaW6k1ZBSfo60CxKrwAONuPqkRvdJdYOYwOTZBH33V6zoSQZDZD'
function sendTextMessage (sender, text) {
  messageData = {
    text: text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: token},
    method: 'POST',
    json: {
      recipient: {id: sender},
      message: messageData,
    }
  }, function (error, response, body) {
    if (error) {
      console.log('Error sending message: ', error)
    } else if (response.body.error) {
      console.log('Error: ', response.body.error)
    }
  })
}
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.send('Hello World')
})
app.get('/webhook', function (req, res) {
  if (req.query['hub.verify_token'] === 'bot_eiei') {
    res.send(req.query['hub.challenge'])
  } else {
    res.send('Error, wrong validation token')
  }
})
app.post('/webhook/', function (req, res) {
  var messaging_events = req.body.entry[0].messaging
  for (var i = 0; i < messaging_events.length; i++) {
    var event = req.body.entry[0].messaging[i]
    var sender = event.sender.id
    if (event.message && event.message.text) {
      var text = event.message.text.split(' ')
      if (text[0] === 'sum') {
        var ans = parseInt(text[1], 0) + parseInt(text[2], 0)
        sendTextMessage(sender, ans)
      } else if (text[0] === 'max') {
        ans = parseInt(text[1], 0) > parseInt(text[2], 0) ? parseInt(text[1], 0) : parseInt(text[2], 0)
        sendTextMessage(sender, ans)
      } else if (text[0] === 'min') {
        ans = parseInt(text[1], 0) < parseInt(text[2], 0) ? parseInt(text[1], 0) : parseInt(text[2], 0)
        sendTextMessage(sender, ans)
      }
    } else if (text[0] === 'avg') {
      var avgSum = 0
      for (var b = 1; b < text.length; b++) {
        avgSum = avgSum + parseInt(text[b])
      }
      var avg = avgSum / (text.length - 1)
      sendTextMessage(sender, avg)
    }
  }
  res.sendStatus(200)
})

app.set('port', (process.env.PORT || 5000))
app.listen(app.get('port'), function () {
  console.log('Example app listening on port' + app.get('port'))
})
