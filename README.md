# My (BI X) Release Countdown

This is a small script that implements a release countdown in pure HTML, CSS and JS.

![Opengraph Screenshot](web/images/screenshot.png)

You can see it in action at https://countdown.bi-x.info - no tracking is happening there (I have disabled all logs on the server side).

Beside date and time when the countdown should be over you can customize the name of the release (the "next release" is the part that is then replaced with your text) and the text that is displayed once the countdown reached zero.

## To consider when deploying your own version

The whole code is available for re-use (MIT License), but the BI X logo SVG in the source **must** to be replaced in case you make your own deployments. It is up to you if you want to remove my MF-circuit-board logo and the link to this repo too, but keeping it is highly appreciated...

## Third party stuff

The BI X Logo (at the bottom right) is the logo of my employer and **must not** be used without explicit permission!  
**This whole thing is not a [BI X](https://bix-digital.com) product**, it just happens that I am working there. This was a fun project made in my free time - but it is intended to be on the screens of our project teams as a reminder when we have the next release planned...

The included font is from [Google Fonts](https://fonts.google.com/specimen/Titillium+Web) and part of this repo to have a full deployment from this place possible - and without loading any elements from third party servers. I have a complete download for teh case I want to use more font-weights and maybe italic in teh web-app at one point in time.
