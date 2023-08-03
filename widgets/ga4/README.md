# Google Analytics (GA4)

This is a simple widget to add Google Analytics to your application. Be sure to enter both a measurement ID and the page title you want to be used.

Find out how to use the `react-ga4` [here](https://www.npmjs.com/package/react-ga4).

## Setup

When you have a fresh clone of the repository, you will need to run `npm install` in order to run this widget. This will read the `package.json` file and install the needed dependencies, namely `react-ga4`.

## Settings

Setting | Description
:-- | :--
Measurement ID | The measurement ID of your Google Analytics property
Page Title | The value for the `title` key in a [pageview](https://developers.google.com/analytics/devguides/collection/ga4/views?client_type=gtm). This value is set to the application name by default.
Hide Config | Toggle on to hide the widget window in the builder. This transparent box can still block clicks in the app, so be sure to send it to the back using the arrange button.