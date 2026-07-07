const fs = require('fs');
let data = fs.readFileSync('seed-data.json', 'utf8');

// Find the last complete user object
// It should end with `}` or `},`
// We will look for the last `{"_id"` and see if we can find a `}` after it.
const lastIdIndex = data.lastIndexOf('{"_id"');
if (lastIdIndex > -1) {
  // Let's just cut off everything from the last `{"_id"`
  data = data.substring(0, lastIdIndex);
  // data should end with `,` or `[`
  if (data.endsWith(',')) {
    data = data.substring(0, data.length - 1);
  }
  data += '],"services":[],"bookings":[],"reviews":[],"favorites":[],"notifications":[]}';
  fs.writeFileSync('seed-data.json', data);
  console.log('Fixed seed-data.json');
} else {
  console.log('Could not find last _id');
}
