// node >=17.1.0 required
import events from './events.json' assert { type: 'json' }
import users from './users.json' assert { type: 'json' }

// MAPS
const userIdToNameMap = users.reduce( (output, {id, name}) => {
  output[id] = name
  return output
}, {})

const nameToEventsMap = events.reduce( (output, {user_id, start_time, end_time}) => { 
  const name = userIdToNameMap[user_id]
  if (!!output[name]) {
    output[name].push({start_time, end_time})
  } else {
    output[name] = [{start_time, end_time}]
  }
  return output 
}, {})


// HELPERS
function combineExistingEvents(names) {
  const combined = names.reduce( (output, name) => {
    const events = nameToEventsMap[name]
    output = output.concat(events)
    return output
  }, [])
  // important
  const sorted = combined.sort( (a, b) => a.start_time > b.start_time ? 1 : -1 )
  return sorted
}

function addZeroIfLengthIsOne(string) {
  return string.length === 1 ? `0${string}` : string
}

function formatAvailableTime(start, end) {
  const startDate = new Date(start)
  let [sYear, sDay, sMonth] = startDate.toLocaleDateString().split('/').reverse()
  sDay = addZeroIfLengthIsOne(sDay)
  sMonth = addZeroIfLengthIsOne(sMonth)
  const formattedStartDate = `${sYear}-${sMonth}-${sDay}`

  const endDate = new Date(end)
  let [eYear, eDay, eMonth] = endDate.toLocaleDateString().split('/').reverse()
  eDay = addZeroIfLengthIsOne(eDay)
  eMonth = addZeroIfLengthIsOne(eMonth)
  const formattedEndDate = `${eYear}-${eMonth}-${eDay}`

  let sHours = startDate.getHours().toString()
  let sMinutes = startDate.getMinutes().toString()
  sHours = addZeroIfLengthIsOne(sHours)
  sMinutes = addZeroIfLengthIsOne(sMinutes)
  const formattedStartTime = `${sHours}:${sMinutes}`

  let eHours = endDate.getHours().toString()
  let eMinutes = endDate.getMinutes().toString()
  eHours = addZeroIfLengthIsOne(eHours)
  eMinutes = addZeroIfLengthIsOne(eMinutes)
  const formattedEndTime = `${eHours}:${eMinutes}`

  return `${formattedStartDate} ${formattedStartTime} - ${formattedStartDate === formattedEndDate ? "" : formattedEndDate + " "}${formattedEndTime}`
}

function formatOutput(arr) {
  const formatted = arr.reduce( (output, string, i) => {
    output += string
    const next = arr[i + 1]
    if (!!next) {
      const currentDate = string.split(" ")[0]
      const nextDate = next.split(" ")[0]
      currentDate === nextDate ? output += "\n" : output += "\n\n"
    }
    return output
  }, "")
  return formatted
}


// SCRIPT
function findAvailableTimes(names, window) {
  const output = []
  const allEvents = combineExistingEvents(names)

  let currentWindow = window
  for(let i = 0; i < allEvents.length; i ++) {
    const { start_time: eventStart, end_time: eventEnd } = allEvents[i]
    const { start_time: windowStart, end_time: windowEnd } = currentWindow
    //continue if event outside range
    if ( windowStart >= eventEnd || windowEnd <= eventStart ) {
      continue
    }
    //add availability if gap between current window start and event start
    if ( windowStart < eventStart ) {
        const availabileTime = formatAvailableTime( windowStart, eventStart )
        output.push( availabileTime )
    } 
    //shrink current window
    currentWindow = { start_time: eventEnd, end_time: windowEnd }
  }
  //add left over time as availability
  if ( currentWindow.start_time < window.end_time ) {
    const availabileTime = formatAvailableTime( currentWindow.start_time, window.end_time )
    output.push( availabileTime )
  }
  
  return formatOutput( output )
}


// TEST
// Jane, John, Maggie, Nick, Emily, Joe, Jordan
const testArray = ["Maggie", "Joe", "Jordan"]
const testWindow = {start_time: "2021-07-05T13:00:00", end_time: "2021-07-07T21:00:00"}
console.log(findAvailableTimes(testArray, testWindow))