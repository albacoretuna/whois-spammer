const Promise = require('bluebird');
const urls = require('./urls.js').urls;
const fs = require('fs');

const urlsFi = urls.map((url) => url+'.fi' );
// BLUEBIRD SAMPLE
/*
var files = [];
for (var i = 0; i < 100; ++i) {
    files.push(fs.writeFileAsync("file-" + i + ".txt", "", "utf-8"));
}
Promise.all(files).then(function() {
    console.log("all the files were created");
});
*/
// end bluebird


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

/*
 * sample single call which works
 doWhois('omisdfsdd.fi')
 .then((url) => {
 sitesAvailable.push(url);
 console.log(sitesAvailable);
 });
 */
const askAllUrls = (allUrls) => {
    const successArray = [];
    // global array of successful domain seraches
    const domainsArray = [];

    return new Promise((resolve) => {
        allUrls.forEach((url) => {
            // console.log('we are in forEach', url);
            successArray.push(doWhois(url)
                .then((url) => domainsArray.push(url)).catch(() => { } ));
        });
        Promise.all(successArray).then(() => {
            resolve(domainsArray);
        })
            .catch((err)=>(console.log(err)));
    });
};
askAllUrls(urlsFi).then((allUrls) => { console.log('domains not registered: ', allUrls.length);
    fs.writeFile('test.json', JSON.stringify(allUrls));
});
