const Promise = require('bluebird');
const urls = require('./data/urls.js').urls;
const fs = require('fs');

const urlsFi = urls.map((url) => url+'.fi' );


const doWhois = (url) => {
    const spawn = require('child_process').spawn;
    const whois = spawn('whois', [url]);

    return new Promise((resolve, reject) => {
        whois.stdout.on('data', (data) => {
            if(data.indexOf('Domain not found') !== -1) {
                resolve(url);
            } else {
                reject(url);
            }
        });

        whois.stderr.on('data', (data) => {
            reject(data);
        });
    });
};

const askAllUrls = (allUrls) => {
    const successArray = [];
    const domainsArray = [];

    return new Promise((resolve) => {
        allUrls.forEach((url) => {
            successArray.push(doWhois(url)
                .then((url) => domainsArray.push(url))
                .catch(() => { } ));
        });

        Promise.all(successArray)
            .then(() => { resolve(domainsArray); })
            .catch((err)=>(console.log(err)));
    });
};

askAllUrls(urlsFi)
    .then((allUrls) => {
        console.log('domains not registered: ', allUrls.length);
        const fileName = 'output/' + Date.now() + '.js';
        fs.writeFile(fileName, JSON.stringify(allUrls));
});
