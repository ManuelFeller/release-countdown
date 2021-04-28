# Manu's Release Countdown

This is a small script that implements a release countdown in pure HTML, CSS and JS.  
It should work on all modern browsers (tested on MacOS Firefox/Chrome/Safari, iOS Safari & Android Firefox/Chrome)

**License**: MIT (except the logos at the bottom left and right)

![Screenshot Dark Version](imagework/screenshot_dark.png)
Countdown in dark mode

![Screenshot Dark Version](imagework/screenshot_light.png)
Countdown in light mode

You can see it in action at https://countdown.devsvr.ws - no tracking is happening there (I have disabled all logs on the server side).

Beside date and time when the countdown should be over you can customize the name of the release (the "next release" is the part that is then replaced with your text) and the text that is displayed once the countdown reached zero.

## Development and Building

First you need to clone this repo and then run `npm install`. After that you can:

- run `npm run start` to run the version in the webpack dev server (browser opens automatically)
- run `npm run build` to generate a deployable version in the `dist` folder

## To consider when deploying your own version

The whole code is available for re-use (MIT License), but the MF-circuit-board logo at the bottom left is my personal "brand". It is up to you if you want to remove the MF-circuit-board logo and the link to this repo in your deployments, but keeping it would be highly appreciated. You are not allowed to use that logo at other places though.

## Third party stuff

The included font is from [Google Fonts](https://fonts.google.com/specimen/Titillium+Web) and part of this repo to have a full deployment from this place possible - and without loading any elements from third party servers. I have a complete download for teh case I want to use more font-weights and maybe italic in teh web-app at one point in time.
