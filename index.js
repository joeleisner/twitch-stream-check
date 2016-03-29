#!/usr/bin/env node --harmony

// Require
var chalk = require('chalk'),
    program = require('commander'),
    request = require('superagent'),
    timeago = require('timeago-words');

// Program (Commander)
program
    .version('1.0.0')
    .arguments('<twitch-username>')
    .option('-g, --game', 'Shows the game the streamer is playing')
    .option('-v, --viewers', 'Shows the amount of viewers the streamer currently has watching')
    .option('-s, --started', 'Shows when the streamer went live')
    .action(function (streamer) {
        request
            .post('https://api.twitch.tv/kraken/streams/' + streamer)
            .set('Accept', 'application/json')
            .end(function (err, res) {
                var stream = JSON.parse(res.text)["stream"],
                    output = '';
                if (stream == null) {
                    output += chalk.red(firstUp(streamer) + ' is not streaming');
                } else {
                    output += chalk.green(firstUp(streamer) + ' is streaming');
                    if (program.game) {output += '\n' + chalk.blue('Game: ') + stream["game"];}
                    if (program.viewers) {output += '\n' + chalk.blue('Viewers: ') + stream["viewers"];}
                    if (program.started) {output += '\n' + chalk.blue('Started: ') + firstUp(timeago(new Date(stream["created_at"])))}
                }
                console.log(output);
            });
    })
    .parse(process.argv);

// Convert first character of string to uppercase
function firstUp(str) {
    return str.substr(0,1).toUpperCase() + str.substr(1);
}
