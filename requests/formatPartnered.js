function partneredStatus(broadcasterType) {
    const partnered = broadcasterType === 'partner',
        conditional = partnered ? 'is' : 'is not',
        suffix      = partnered || !broadcasterType ? '' : ` (${ broadcasterType })`;
    return `This streamer ${ conditional } partnered` + suffix;
}

function formatPartnered(broadcasterType) {
    const style = !broadcasterType ? 'red' : 'blue',
        label   = 'Partnered?',
        text    = !broadcasterType ? 'No partnered data found!' : partneredStatus(broadcasterType);
    return { style, label, text };
}

module.exports = formatPartnered;