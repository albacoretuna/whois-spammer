const http = require('http');
const fs = require('fs');
const curlCommand = require('./curl-command.js').curlCommand;
let failed = [];

let c = 0;
const availableSites = require('./available-sites.js').availableSites;
function handleResponse(response, url) {
    if (response.indexOf('item-notfree') === -1) {
        fs.appendFile('free-domains.txt', `This is available: ${url} \n\n`, function (err) {
            if(err) {
                console.log(err);
            }
        });
    } else {
        fs.appendFile('other-domains.txt', `${c} This is not free: ${url} \n\n`, function (err) {
            c++;
            if(err) {
                console.log(err);
            }
        });

    }
}


/**
  var request = require('request');

  request.post(
  'http://www.yoursite.com/formpage',
  { json: { key: 'value' } },
  function (error, response, body) {
  if (!error && response.statusCode == 200) {
  console.log(body)
  }
  }
  );




 **/
const exec = require('child_process').exec;
const runCurl = (command, domain) => {
exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    handleResponse(stdout, domain);
    console.log(`stderr: ${stderr}`);
});
};

availableSites.forEach((domain) => runCurl(curlCommand(domain), domain));
// availableSites.forEach((url) => checker);
