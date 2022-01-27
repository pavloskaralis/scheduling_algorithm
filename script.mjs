import { validateArgs } from "./validators.mjs";
import { formatAvailableTime, formatOutput } from "./formatters.mjs";
import {
  toDateRange,
  trimWithinLimit,
  splitTimeWindowByDate,
  isAboveMinDuration,
  getExistingEvents,
} from "./helpers.mjs";

function findAvailableTimes(names, dateRange, dailyLimits, minMinutes) {
  validateArgs(dateRange, dailyLimits);
  const output = [];
  const events = getExistingEvents(names);

  //iteratively shorten date range when event encountered
  let currentDateRange = dateRange;
  for (let i = 0; i < events.length; i++) {
    const { startTime: nextEventStart, endTime: nextEventEnd } = events[i];
    const { startTime: dateRangeStart, endTime: dateRangeEnd } = currentDateRange;
    //skip next steps if event is outside date range
    if (dateRangeStart >= nextEventEnd || dateRangeEnd <= nextEventStart) {
      continue;
    }
    //add availability if time gap exists between current date range start and next event start
    if (dateRangeStart < nextEventStart) {
      const availability = toDateRange(dateRangeStart, nextEventStart);
      const trimmed = trimWithinLimit(availability, dailyLimits);
      trimmed.forEach( date => {
        if (isAboveMinDuration(date, minMinutes)) {
          const formatted = formatAvailableTime(date);
          output.push(formatted);
        }
      })
    }
    //shrink current dateRange
    currentDateRange = toDateRange(nextEventEnd, dateRangeEnd);
  }
  //add left over time as availability
  if (currentDateRange.startTime < dateRange.endTime) {
    const availability = toDateRange(currentDateRange.startTime, dateRange.endTime);
    const trimmed = trimWithinLimit(availability, dailyLimits);
    trimmed.forEach( date => {
      if (isAboveMinDuration(date, minMinutes)) {
        const formatted = formatAvailableTime(date);
        output.push(formatted);
      }
    })
  }

  return formatOutput(output);
}

// TEST
// Jane, John, Maggie, Nick, Emily, Joe, Jordan
const testArray = ["Maggie", "Joe", "Jordan"];
// const testArray = [];
const testWindow = {
  startTime: "2021-07-05T13:00:00",
  endTime: "2021-07-07T21:00:00",
};
const testDailyLimits = {
  startHours: 9,
  startMinutes: 0,
  endHours: 17,
  endMinutes: 0,
};
const testMinimumMinutes = 1;
console.log(
  findAvailableTimes(testArray, testWindow, testDailyLimits, testMinimumMinutes)
);
