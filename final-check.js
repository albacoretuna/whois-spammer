const http = require('http');
const Promise = require('bluebird');
const fs = require('fs');
const exec = require('child_process').exec;
const curlCommand = require('./data/curl-command.js').curlCommand;
const availableSites = require('./data/available-sites.js').availableSites;

let count = 0;

const handleResponse = (response, url, resolve, reject) => {
    if (response.indexOf('item-notfree') === -1) {
        fs.appendFile('output/free-domains.txt',
            `This is available: ${url} \n\n`,
            (err) => {
            resolve();
            if(err) {
                console.log('error in appending to free domains');
                reject();
            }
        });
    } else {
        fs.appendFile('output/other-domains.txt',
            `${count} This is not free: ${url} \n\n`,
            (err) => {
                resolve();
                count++;
                if(err) {
                    console.log('error in appending to otherdomains');
                    reject();
                }
            });

    }
};


const runCurl = (command, domain) => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            handleResponse(stdout, domain, resolve);
        });

    });
};
async function runOnce(domain) {
    await runCurl(curlCommand(domain), domain);
}
availableSites.forEach((domain) => runOnce(domain));
