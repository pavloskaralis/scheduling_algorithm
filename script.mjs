import { nameToEventsMap } from "./maps.mjs";
import { validateArgs } from "./validators.mjs";
import { formatAvailableTime, formatOutput } from "./formatters.mjs";
import {
  toTimeWindow,
  trimWithinLimit,
  splitTimeWindowByDate,
  isAboveMinDuration,
  combineExistingEvents,
} from "./helpers.mjs";
// HELPERS

// SCRIPT
function findAvailableTimes(names, window, limits, minMinutes) {
  validateArgs(window, limits);
  const output = [];
  const allEvents = combineExistingEvents(names);

  let currentWindow = window;
  for (let i = 0; i < allEvents.length; i++) {
    const { startTime: eventStart, endTime: eventEnd } = allEvents[i];
    const { startTime: windowStart, endTime: windowEnd } = currentWindow;
    //continue if event outside range
    if (windowStart >= eventEnd || windowEnd <= eventStart) {
      continue;
    }
    //add availability if gap between current window start and event start
    if (windowStart < eventStart) {
      const availability = toTimeWindow(windowStart, eventStart);
      const splitByDate = splitTimeWindowByDate(availability);
      splitByDate.forEach((date) => {
        const trimmed = trimWithinLimit(date, limits);
        if (isAboveMinDuration(trimmed, minMinutes)) {
          const formatted = formatAvailableTime(trimmed);
          output.push(formatted);
        }
      });
    }
    //shrink current window
    currentWindow = toTimeWindow(eventEnd, windowEnd);
  }
  //add left over time as availability
  if (currentWindow.startTime < window.endTime) {
    const availability = toTimeWindow(currentWindow.startTime, window.endTime);
    const splitByDate = splitTimeWindowByDate(availability);
    splitByDate.forEach((date) => {
      const trimmed = trimWithinLimit(date, limits);
      if (isAboveMinDuration(trimmed, minMinutes)) {
        const formatted = formatAvailableTime(trimmed);
        output.push(formatted);
      }
    });
  }

  return formatOutput(output);
}

// TEST
// Jane, John, Maggie, Nick, Emily, Joe, Jordan
const testArray = ["Maggie",  "Joe", "Jordan"];
const testWindow = {
  startTime: "2021-07-05T13:00:00",
  endTime: "2021-07-07T21:00:00",
};
const testLimits = {
  startHours: 9,
  startMinutes: 0,
  endHours: 17,
  endMinutes: 0,
};
const testMinimumMinutes = 1;
console.log(
  findAvailableTimes(testArray, testWindow, testLimits, testMinimumMinutes)
);
