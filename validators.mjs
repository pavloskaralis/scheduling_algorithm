//validates date range and daily limits arguments
export function validateArgs(
  { startTime, endTime },
  { startHours, startMinutes, endHours, endMinutes }
) {
  switch (true) {
    case startTime > endTime:
      throw "window start time cannot be after window end time";
    case startHours > endHours:
      throw "daily limit start cannot be after daily limit end";
    case startHours === endHours && startMinutes > endMinutes:
      throw "daily limit start cannot be after daily limit end";
    case startHours > 24 || endHours > 24:
      throw "daily limit hours cannot exceed 24"
    case startMinutes > 59 || endMinutes > 59:
      throw "daily limit minnutes cannot exceed 59"
  }
}
