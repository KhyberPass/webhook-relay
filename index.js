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
    if (error) {
      console.log(error);
      return;
    }
    console.log(response.body);
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
  
  // Check the received data to ensure that it is correct
  // it should have a .type and .cmd
  // var y = obj.hasOwnProperty("name");
  if (!("type" in body)) {
    console.log('Invalid data: key type missing');
    return;
  }
  if (!("cmd" in body)) {
    console.log('Invalid data: key cmd missing');
    return;
  }
    
  // Send the post out

  // A Google Assistant turn on POST
  if (body.type == 'ga-turn') {
    // Get the data
    var cmd = body.cmd.replace('the ','').toLowerCase();

    switch(cmd) {
      case 'tv on':
      case 'tv off':
        sendUrl(LIRC_URL + 'remotes/sony/KEY_POWER');
        break;

      case 'radio off':
      case 'radio on':
      case 'kitchen off':
      case 'kitchen on':
        sendUrl(LIRC_URL + 'remotes/pana/KEY_POWER');
        break;

      case 'radio volume default':
      case 'kitchen volume default':
        sendUrl(LIRC_URL + 'macros/Radio%20Volume%20Default');
        break;

      case 'radio volume up':
      case 'kitchen volume up':
        sendUrl(LIRC_URL + 'remotes/pana/KEY_VOLUMEUP/repeat/5');
        break;

      case 'radio volume down':
      case 'kitchen volume down':
        sendUrl(LIRC_URL + 'remotes/pana/KEY_VOLUMEDOWN/repeat/5');
        break;

      case 'fan on':
        sendUrl(PSW_URL + 'cm?cmnd=Power%20On');
        break;

      case 'fan off':
        sendUrl(PSW_URL + 'cm?cmnd=Power%20Off');
        break;
       
      default:
        console.log('Invalid data: command not found', cmd);
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
