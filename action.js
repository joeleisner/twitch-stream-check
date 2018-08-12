const chalk = require('chalk'),
    request = require('superagent'),
    timeago = require('timeago-words');

// Initialize global variables for streamer/program
let _streamer, _program;

// Converts the first character of a string to uppercase
function firstUp(string) {
    return string.substr(0,1).toUpperCase() + string.substr(1);
}

// Output a message with a specified style to the console
function output(style, ...value) {
    const styled = value.shift();
    return console.log(chalk[style](styled), ...value);
}

// Handle request failure
function failure(error) {
    output('red', 'An error occured!', error.code);
    return process.exit(1);
}

// Handle streamers not streaming
function notStreaming(streamer) {
    output('red', streamer + ' is not streaming!');
    return process.exit(1);
}

// Return a string specifying whether the streamer is mature or not
function matureStatus(mature) {
    return `This streamer ${ mature ? 'streams' : 'does not stream' } mature content`;
}

// Return a string specifying whether the streamer is partnered or not
function partneredStatus(partnered) {
    return `This streamer ${ partnered ? 'is' : 'is not' } partnered`;
}

// Handle request success
function success(response) {
    // Attempt to get stream information from the response
    const streamer = firstUp(_streamer),
        stream     = JSON.parse(response.text).stream;
    // If there's no stream, let the user know the streamer is not streaming
    if (!stream) return notStreaming(streamer);
    // Let the user know the streamer is streaming
    output('green', streamer + ' is streaming!');
    // Get all possible flags from the program...
    const {
        game, viewers, started,
        mature, title, partnered, followers
    } = _program;
    // ... and output messages on those that are set
    if (game)      output('blue', 'Game',       stream.game);
    if (viewers)   output('blue', 'Viewers',    stream.viewers);
    if (started)   output('blue', 'Started',    firstUp(timeago(new Date(stream.created_at))));
    if (mature)    output('blue', 'Mature?',    matureStatus(stream.channel.mature));
    if (title)     output('blue', 'Title',      stream.channel.status);
    if (partnered) output('blue', 'Partnered?', partneredStatus(stream.channel.partner));
    if (followers) output('blue', 'Followers',  stream.channel.followers);
}

// Handle the request response
function response(error, response) {
    return error ? failure(error) : success(response);
}

// Get/output the streamer's details
module.exports = (streamer, program) => {
    // Make the streamer/program globally accessible
    _streamer = streamer;
    _program  = program;
    // Store the URL and request headers...
    const url = 'https://api.twitch.tv/kraken/streams/' + streamer,
        header = {
            clientId: [ 'Client-ID', '3zzmx0l2ph50anf78iefr6su9d8byj8' ],
            accept:   [ 'Accept',    'application/json' ]
        };
    // ... and make the request
    request.get(url).set(...header.clientId).set(...header.accept).end(response);
};