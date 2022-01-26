import { nameToEventsMap } from "./maps.mjs";

export function combineExistingEvents(names) {
  const combined = names.reduce((output, name) => {
    const events = nameToEventsMap[name];
    output = output.concat(events);
    return output;
  }, []);
  // important
  const sorted = combined.sort((a, b) => (a.startTime > b.startTime ? 1 : -1));
  return sorted;
}

export function toTimeWindow(startTime, endTime) {
  return { startTime, endTime };
}

export function trimWithinLimit(
  { startTime, endTime },
  { startHours, startMinutes, endHours, endMinutes }
) {
  const limitStartDate = new Date(startTime);
  limitStartDate.setHours(startHours);
  limitStartDate.setMinutes(startMinutes);
  const startTimeISO = limitStartDate.toISOString();
  const limitStartTime = startTimeISO.slice(0, startTimeISO.length - 5);

  const limitEndDate = new Date(startTime);
  limitEndDate.setHours(endHours);
  limitEndDate.setMinutes(endMinutes);
  const endTimeISO = limitEndDate.toISOString();
  const limitEndTime = endTimeISO.slice(0, endTimeISO.length - 5);

  return {
    startTime: startTime < limitStartTime ? limitStartTime : startTime,
    endTime: endTime > limitEndTime ? limitEndTime : endTime,
  };
}

export function getNextDate(time) {
  const date = new Date(time);
  date.setDate(date.getDate() + 1);
  date.setHours(0);
  date.setMinutes(0);
  const nextDateISO = date.toISOString();
  const nextDate = nextDateISO.slice(0, nextDateISO.length - 5);
  return nextDate;
}

export function splitTimeWindowByDate({ startTime, endTime }) {
  const output = [];
  let startDate = new Date(startTime);
  let endDate = new Date(endTime);
  if (startDate.toLocaleDateString() === endDate.toLocaleDateString()) {
    const date = toTimeWindow(startTime, endTime);
    output.push(date);
  } else {
    const days = endDate.getDate() - startDate.getDate();
    let nextDate = getNextDate(startTime);
    let date = toTimeWindow(startTime, nextDate);
    output.push(date);
    for (let i = 1; i < days; i++) {
      const currentDate = nextDate;
      nextDate = getNextDate(nextDate);
      date = toTimeWindow(currentDate, nextDate);
      output.push(date);
    }
    date = toTimeWindow(nextDate, endTime);
    output.push(date);
  }

  return output;
}

export function isAboveMinDuration({ startTime, endTime }, minutes) {
  const startDate = new Date(startTime);
  const startMS = startDate.getTime();
  const endDate = new Date(endTime);
  const endMS = endDate.getTime();

  const difference = endMS - startMS;
  const minutesToMS = minutes * 60 * 1000;
  return difference >= minutesToMS;
}
