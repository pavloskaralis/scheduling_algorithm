import { validateArgs } from "./validators.mjs";
import { formatAvailableTime, formatOutput } from "./formatters.mjs";
import {
  toDateRange,
  trimWithinLimit,
  meetsDurationReq,
  getExistingEvents,
} from "./helpers.mjs";

function findAvailableTimes(names, dateRange, dailyLimits, minMinutes) {
  validateArgs(dateRange, dailyLimits);
  const output = [];
  const events = getExistingEvents(names);

  //iteratively shorten date range as events are encountered
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
      const timeGap = toDateRange(dateRangeStart, nextEventStart);

      //trim and break apart time gap based on daily limits
      const trimmed = trimWithinLimit(timeGap, dailyLimits);
      trimmed.forEach((availability) => {
        //check that trim is greater or equal to minimum minutes requirement
        if (meetsDurationReq(availability, minMinutes)) {
          const formatted = formatAvailableTime(availability);
          output.push(formatted);
        }
      });
    }

    //shorten date range start to next event end
    currentDateRange = toDateRange(nextEventEnd, dateRangeEnd);
  }

  //process any remaining time gap
  if (currentDateRange.startTime < dateRange.endTime) {
    const timeGap = toDateRange(currentDateRange.startTime, dateRange.endTime);

    //trim and break apart time gap based on daily limits
    const trimmed = trimWithinLimit(timeGap, dailyLimits);
    trimmed.forEach((availability) => {
      //check that trim is greater or equal to minimum minutes requirement
      if (meetsDurationReq(availability, minMinutes)) {
        const formatted = formatAvailableTime(availability);
        output.push(formatted);
      }
    });
  }

  return formatOutput(output);
}

//"Jane", "John", "Maggie", "Nick", "Emily", "Joe", "Jordan"
const testArray = ["Maggie", "Joe", "Jordan"];
const testWindow = {
  startTime: "2021-07-05T13:00:00",
  endTime: "2021-07-07T21:00:00",
};
//0 0 24 for no daily limit
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
