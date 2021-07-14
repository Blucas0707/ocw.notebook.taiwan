require('dotenv').config({path:__dirname+'/../../.env'});
var AWS = require('aws-sdk');
var region = 'us-east-2'; // e.g. us-west-1
var domain = 'search-courses-ptaras3nil34n6zdm7mfwnljhe.us-east-2.es.amazonaws.com'; // e.g. search-domain.region.es.amazonaws.com
var index = "courses";
var type = '_search';
var json = {
  "query": {
    "query_string": {
      "query": "文化",
      "default_field": "course_name"
    }
  }
};

let ES = {
  searchKeyword:function(keyword){
    let searchBody = {
      "query": {
        "query_string": {
          "query": keyword,
          "default_field": "course_name",
          "default_operator": "AND"
        }
      }
    };
    var endpoint = new AWS.Endpoint(domain);
    var request = new AWS.HttpRequest(endpoint, region);

    request.method = 'GET';
    request.path += index + '/' + type;
    request.body = JSON.stringify(searchBody);
    request.headers['host'] = domain;
    request.headers['Content-Type'] = 'application/json';
    // Content-Length is only needed for DELETE requests that include a request
    // body, but including it for all requests doesn't seem to hurt anything.
    request.headers['Content-Length'] = Buffer.byteLength(request.body);

    var credentials = new AWS.EnvironmentCredentials('AWS');
    credentials.accessKeyId = process.env.AWS_ACCESS_KEY;
    credentials.secretAccessKey = process.env.AWS_SECRET_KEY;
    var signer = new AWS.Signers.V4(request, 'es');
    signer.addAuthorization(credentials, new Date());

    return new Promise((resolve,reject)=>{
      var client = new AWS.HttpClient();
      client.handleRequest(request, null, function(response) {
        // console.log(response.statusCode + ' ' + response.statusMessage);
        var responseBody = '';
        response.on('data', function (chunk) {
          responseBody += chunk;
        });
        response.on('end', function (chunk) {
          // console.log('Response body: ' + responseBody);
          resolve(responseBody)
        });
      }, function(error) {
        console.log('Error: ' + error);
      });
    })
  }
};

module.exports = ES;
