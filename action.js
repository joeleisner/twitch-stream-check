const twitchApi = require('./modules/twitchApi'),
    output      = require('./modules/output'),
    timeago     = require('timeago-words');

const getFollowers  = require('./requests/getFollowers'),
    getGame         = require('./requests/getGame'),
    formatPartnered = require('./requests/formatPartnered');

// Converts the first character of a string to uppercase
function firstUp(string) {
    return string.substr(0,1).toUpperCase() + string.substr(1);
}

// Handle a failure
function failure(...error) {
    output('red', ...error);
    return process.exit(1);
}

// // Return a string specifying whether the streamer is mature or not
// function matureStatus(mature) {
//     return `This streamer ${ mature ? 'streams' : 'does not stream' } mature content`;
// }

// Get/output the streamer's details
module.exports = async (streamer, program) => {
    // Get the streamer's account information...
    const users = await twitchApi('users', 'login', streamer);
    // ... and if there's no data, let the user know the streamer does not exist
    if (!users.length) return failure(streamer + ' does not exist!');
    // Get the streamer's stream information...
    const data = await twitchApi('streams', 'user_login', streamer);
    // ... and if there's no data, let the user know the streamer is not streaming
    if (!data.length) return failure(streamer + ' is not streaming!');
    // Grab the user from the users...
    const user = users[0];
    // ... and the stream from the data
    const stream = data[0];
    // Let the user know the streamer is streaming
    output('green', streamer + ' is streaming!');
    // Get all possible flags from the program...
    const {
        followers, game, mature, partnered,
        started, title, viewers
    } = program;
    // ... and initialize an array to store messages
    let messages = [];
    // Retrieve data and store messages for flags that are used
    if (followers) messages.push(await getFollowers(stream.user_id));
    if (game)      messages.push(await getGame(stream.game_id));
    // if (mature)    output('blue', 'Mature?',    matureStatus(stream.channel.mature));
    if (partnered) messages.push(formatPartnered(user.broadcaster_type));
    if (started)   messages.push({ style: 'blue', label: 'Started', text: firstUp(timeago(new Date(stream.started_at))) });
    if (title)     messages.push({ style: 'blue', label: 'Title',   text: stream.title });
    if (viewers)   messages.push({ style: 'blue', label: 'Viewers', text: stream.viewer_count })
    // Finally, output the messages
    messages.map(message => output(message.style, message.label, message.text));
};