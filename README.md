# Twitch-Stream-Check
*A simple Node.js command line tool to check to see if a Twitch user is streaming or not*

![alt tag](https://raw.githubusercontent.com/joeleisner/twitch-stream-check/screenshot.png)

## How to Install
```
$ npm i -g twitch-stream-check
```

## How to Use
To use this command line tool, use the `twitch-stream-check [options] <streamer>` structure, where `<streamer>` is the Twitch username you'd like check

### [options]
* **-g, --game** - Shows the game the streamer is playing
* **-v, --viewers** - Shows the amount of viewers the streamer currently has watching
* **-s, --started** - Shows when the streamer went live

### Version/Help
* **To check version** - `twitch-stream-check -V`
* **To check help** - `twitch-stream-check -h`
