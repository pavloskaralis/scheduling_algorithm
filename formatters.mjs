export function addZeroIfLengthIsOne(string) {
  return string.length === 1 ? `0${string}` : string;
}

export function formatAvailableTime({ startTime, endTime }) {
  const startDate = new Date(startTime);
  let [sYear, sDay, sMonth] = startDate
    .toLocaleDateString()
    .split("/")
    .reverse();
  sDay = addZeroIfLengthIsOne(sDay);
  sMonth = addZeroIfLengthIsOne(sMonth);
  const formattedStartDate = `${sYear}-${sMonth}-${sDay}`;

  const endDate = new Date(endTime);
  let [eYear, eDay, eMonth] = endDate.toLocaleDateString().split("/").reverse();
  eDay = addZeroIfLengthIsOne(eDay);
  eMonth = addZeroIfLengthIsOne(eMonth);
  const formattedEndDate = `${eYear}-${eMonth}-${eDay}`;

  let sHours = startDate.getHours().toString();
  let sMinutes = startDate.getMinutes().toString();
  sHours = addZeroIfLengthIsOne(sHours);
  sMinutes = addZeroIfLengthIsOne(sMinutes);
  const formattedStartTime = `${sHours}:${sMinutes}`;

  let eHours = endDate.getHours().toString();
  let eMinutes = endDate.getMinutes().toString();
  eHours = addZeroIfLengthIsOne(eHours);
  eMinutes = addZeroIfLengthIsOne(eMinutes);
  const formattedEndTime = `${eHours}:${eMinutes}`;

  return `${formattedStartDate} ${formattedStartTime} - ${
    formattedStartDate === formattedEndDate ? "" : formattedEndDate + " "
  }${formattedEndTime}`;
}

export function formatOutput(arr) {
  const formatted = arr.reduce((output, string, i) => {
    output += string;
    const next = arr[i + 1];
    if (!!next) {
      const currentDate = string.split(" ")[0];
      const nextDate = next.split(" ")[0];
      currentDate === nextDate ? (output += "\n") : (output += "\n\n");
    }
    return output;
  }, "");
  return formatted;
}
