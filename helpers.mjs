import { nameToEventsMap } from "./maps.mjs";

//combine all events by name and sort
export function getExistingEvents(names) {
  const combined = names.reduce((map, name) => {
    const events = nameToEventsMap[name];
    map = map.concat(events);
    return map;
  }, []);

  //important
  const sorted = combined.sort((a, b) => (a.startTime > b.startTime ? 1 : -1));
  return sorted;
}

//date range factory
export function toDateRange(startTime, endTime) {
  return { startTime, endTime };
}

//trim and break apart date range to fit within time limits
export function trimWithinLimit(
  { startTime, endTime },
  { startHours, startMinutes, endHours, endMinutes }
) {
  const output = [];
  const startDate = new Date(startTime);
  const endDate = new Date(endTime);
  const days = endDate.getDate() - startDate.getDate() + 1;
  let currentStartTime = startTime;

  //condition for no daily time limits
  if (startHours === 0 && startMinutes === 0 && endHours === 24) {
    const notTrimmed = toDateRange(startTime, endTime);
    output.push(notTrimmed);
  } else {
    for (let i = 0; i < days; i++) {
      //format daily limit start for current date
      const currentStartLimit = new Date(currentStartTime);
      currentStartLimit.setHours(startHours);
      currentStartLimit.setMinutes(startMinutes);
      const startLimitISO = currentStartLimit.toISOString();
      const startLimit = startLimitISO.slice(0, startLimitISO.length - 5);

      //format daily limit end for current date
      const currentEndLimit = new Date(currentStartTime);
      currentEndLimit.setHours(endHours);
      currentEndLimit.setMinutes(endMinutes);
      const endLimitISO = currentEndLimit.toISOString();
      const endLimit = endLimitISO.slice(0, endLimitISO.length - 5);

      //trim if date range start or end falls outside of daily limits
      const trimmed = {
        startTime:
          currentStartTime < startLimit ? startLimit : currentStartTime,
        endTime: endTime > endLimit ? endLimit : endTime,
      };
      output.push(trimmed);
      //start next iteration at the start of the next day
      currentStartTime = getNextDate(trimmed.startTime);
    }
  }

  return output;
}

//returns formatted version of next date
export function getNextDate(time) {
  const date = new Date(time);
  date.setDate(date.getDate() + 1);
  date.setHours(0);
  date.setMinutes(0);
  const nextDateISO = date.toISOString();
  const nextDate = nextDateISO.slice(0, nextDateISO.length - 5);
  return nextDate;
}

//checks that availability range meets minimum duration requirement
export function meetsDurationReq({ startTime, endTime }, minutes) {
  const startDate = new Date(startTime);
  const startMS = startDate.getTime();
  const endDate = new Date(endTime);
  const endMS = endDate.getTime();

  const difference = endMS - startMS;
  const minutesToMS = minutes * 60 * 1000;
  return difference >= minutesToMS;
}
