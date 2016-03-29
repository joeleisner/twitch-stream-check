#!/usr/bin/env node --harmony

// Require
var chalk = require('chalk'),
    program = require('commander'),
    request = require('superagent'),
    timeago = require('timeago-words');

// Program (Commander)
program
    .version('1.1.0')
    .arguments('<twitch-username>')
    .option('-g, --game', 'Shows the game the streamer is playing')
    .option('-v, --viewers', 'Shows the amount of viewers the streamer currently has watching')
    .option('-s, --started', 'Shows when the streamer went live')
    .option('-m, --mature', 'Shows whether the streamer streams mature content or not')
    .option('-t, --title', 'Shows the current stream title')
    .option('-p, --partnered', 'Shows whether the streamer is partnered or not')
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
                    if (program.mature) {
                        var msg;
                        if (stream["channel"]["mature"]) {
                            msg = 'This streamer streams mature content';
                        } else {
                            msg = 'This streamer does not stream mature content';
                        }
                        output += '\n' + chalk.blue('Mature?: ') + msg;
                    }
                    if (program.title) {output += '\n' + chalk.blue('Title: ') + stream["channel"]["status"];}
                    if (program.partnered) {
                        var msg;
                        if (stream["channel"]["partner"]) {
                            msg = 'This streamer is partnered';
                        } else {
                            msg = 'This streamer is not partnered';
                        }
                        output += '\n' + chalk.blue('Partnered?: ') + msg;
                    }
                }
                console.log(output);
            });
    })
    .parse(process.argv);

// Convert first character of string to uppercase
function firstUp(str) {
    return str.substr(0,1).toUpperCase() + str.substr(1);
}
