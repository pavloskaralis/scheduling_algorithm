// node >=17.1.0 required
import events from "./events.json" assert { type: "json" };
import users from "./users.json" assert { type: "json" };

export const userIdToNameMap = users.reduce((output, { id, name }) => {
  output[id] = name;
  return output;
}, {});

export const nameToEventsMap = events.reduce(
  (output, { user_id, start_time, end_time }) => {
    const name = userIdToNameMap[user_id];
    if (!!output[name]) {
      output[name].push({ startTime: start_time, endTime: end_time });
    } else {
      output[name] = [{ startTime: start_time, endTime: end_time }];
    }
    return output;
  },
  {}
);
