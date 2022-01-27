//adds 0 in front of single digit number
export function addZeroIfSingleDigit(string) {
  return string.length === 1 ? `0${string}` : string;
}

//formats time to  match README.md example output
export function formatAvailableTime({ startTime, endTime }) {
  //format start date
  const startDate = new Date(startTime);
  let [sYear, sDay, sMonth] = startDate
    .toLocaleDateString()
    .split("/")
    .reverse();
  sDay = addZeroIfSingleDigit(sDay);
  sMonth = addZeroIfSingleDigit(sMonth);
  const formattedStartDate = `${sYear}-${sMonth}-${sDay}`;

  //format end date
  const endDate = new Date(endTime);
  let [eYear, eDay, eMonth] = endDate.toLocaleDateString().split("/").reverse();
  eDay = addZeroIfSingleDigit(eDay);
  eMonth = addZeroIfSingleDigit(eMonth);
  const formattedEndDate = `${eYear}-${eMonth}-${eDay}`;

  //format start time
  let sHours = startDate.getHours().toString();
  let sMinutes = startDate.getMinutes().toString();
  sHours = addZeroIfSingleDigit(sHours);
  sMinutes = addZeroIfSingleDigit(sMinutes);
  const formattedStartTime = `${sHours}:${sMinutes}`;

  //format end time
  let eHours = endDate.getHours().toString();
  let eMinutes = endDate.getMinutes().toString();
  eHours = addZeroIfSingleDigit(eHours);
  eMinutes = addZeroIfSingleDigit(eMinutes);
  const formattedEndTime = `${eHours}:${eMinutes}`;

  //piece it all together
  return `${formattedStartDate} ${formattedStartTime} - ${
    formattedStartDate === formattedEndDate ? "" : formattedEndDate + " "
  }${formattedEndTime}`;
}

//formats final output to  match README.md example output
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
