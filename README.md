# Instructions

Requires node version 17.1.0 or above:<br/>
nvm install 17.1.0<br/>
[nvm install instructions](https://tecadmin.net/install-nvm-macos-with-homebrew/)

To start script run:<br/>
npm start

Test variables at the bottom of script.mjs exist to be altered.

# Description

The main script function takes in the following arguments:

- names: a string array of names to search events for
- dateRange: a start time and end time string which specify the search boundaries
- dailyLimits: 4 integers to specify daily start time and end time limits (hours and minutes)
- minMinutes: an integer to specify the minimum availability duration in minutes

The script was designed to be flexible, and even returns multi-day availabilities when 0,0,24,0 are passed as daily limits. The algorithm's steps were determined by first drawing out the problem by hand, and operates by iteratively shortening the date range as events are encountered. If the next event falls outside the date range, no outcome results. Should the next event fall within the date range and create a time gap, that availability is then processed to fit within the daily limits. The date range's start is then shortened to the event's end for the next iteration. After all events are cycled through, any remaining time gap is also processed.
