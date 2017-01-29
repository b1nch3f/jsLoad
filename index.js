
var https = require('https');
var libxmljs = require("libxmljs");
var parseString = require('xml2js').parseString;

var xmlString = '';
var creds = {uname:'#username', pass:'#pass+security-token(if IP range is not 0.0.0.0 - 255.255.255.255'};

xmlString = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:enterprise.soap.sforce.com">';
xmlString +=  '<soapenv:Body>';
xmlString +=    '<urn:login>';
xmlString +=      '<urn:username>';
xmlString +=       creds.uname;
xmlString +=      '</urn:username>';
xmlString +=      '<urn:password>';
xmlString +=      creds.pass;
xmlString +=      '</urn:password>';
xmlString +=    '</urn:login>';
xmlString +=  '</soapenv:Body>';
xmlString += '</soapenv:Envelope>';

var options = {
  hostname: 'login.salesforce.com',
  port: 443,
  path: '/services/Soap/c/36.0',
  method: 'POST',
  headers: {
    'Content-Type': 'text/xml',
    'SOAPAction': '""'
  }
};

var req = https.request(options, (res) => {
  //console.log(`STATUS: ${res.statusCode}`);
  //console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  var response = '';
  res.on('data', (chunk) => {
    response += chunk;
  });
  res.on('end', () => {
    //console.log('No more data in response.');
    //console.log(response);
    var xml = response;
    var xmlDoc = libxmljs.parseXml(xml);
    
    var xml = response;
    parseString(xml, function (err, result) {
        //console.dir(result);
        // weird parsing to be replaced by xpath or something
        var serverUrl = result['soapenv:Envelope']['soapenv:Body'][0].loginResponse[0].result[0].serverUrl[0];
        var sessionId = result['soapenv:Envelope']['soapenv:Body'][0].loginResponse[0].result[0].sessionId[0];
        
        console.log('serverUrl ', serverUrl);
        console.log('sessionId ', sessionId);

        // can now make any soap call...
    });
  });
});

req.on('error', (e) => {
  console.log(`problem with request: ${e.message}`);
});

// write data to request body
req.write(xmlString);
req.end();