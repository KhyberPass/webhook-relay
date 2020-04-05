var express = require('express'),
  bodyParser = require('body-parser'),
  app = express(),
  port = 4000;

var request = require('request');

//var LIRC_URL = 'https://nicktest.requestcatcher.com/test/';
var LIRC_URL = 'http://192.168.111.41:3000/';
var PSW_URL = 'http://192.168.111.59/';


function sendUrl(url) {
  var options = {
    uri: url,
    body: '',
    method: 'POST',
    headers: {
      'Content-Type': 'application/text/plain'
    }
  };
  console.log(url);
  request.post(options, function (error, response) {
    console.log(error, response.body);
    return;
  });
}

function sendPost(postData) {
  var options = {
    uri: LIRC_URL,
    body: JSON.stringify(postData),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  request(options, function (error, response) {
    console.log(error, response.body);
    return;
  });
};

app.use(bodyParser.json());

app.post('/', function (req, res) {
  var body = req.body;

  console.log('Received', body);
  //console.log('Data', body.msg.type);

  // Send the post out

  // A Google Assistant turn on POST
  if (body.type == 'ga-turn') {
    // Get the data
    var cmd = body.cmd.replace('the ','').toLowerCase();

    if (cmd == 'tv on') {
      sendUrl(LIRC_URL + 'remotes/sony/KEY_POWER');
    }
    if (cmd == 'tv off') {
      sendUrl(LIRC_URL + 'remotes/sony/KEY_POWER');
    }
    if (cmd == 'radio off') {
      sendUrl(LIRC_URL + 'remotes/pana/KEY_POWER');
    }
    if (cmd == 'fan on') {
      sendUrl(PSW_URL + 'cm?cmnd=Power%20On');
    }
    if (cmd == 'fan off') {
      sendUrl(PSW_URL + 'cm?cmnd=Power%20Off');
    }
  }

  res.json({
    message: 'ok got it!'
  });
});

var server = app.listen(port, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
});
