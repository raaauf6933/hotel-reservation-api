const moment = require("moment-timezone");

let date_time_today = moment.tz("Asia/Manila");
let check_in = moment("2022-02-28").format("YYYY-MM-DD");

// console.log(date_time_today);
// console.log(check_in);
// console.log(date_time_today.add(1, "days").format("YYYY-MM-DD") === check_in);

let expiration_date_tommorow = moment().endOf("day").format();

let expiration_date = moment("2022-02-27T12:37:00+08:00")
  .tz("Asia/Manila")
  // .add(1, "minute")
  .format("YYYY-MM-DD HH:mm");

console.log(date_time_today.format());
console.log(expiration_date);
let isExpired =
  date_time_today.format("YYYY-MM-DD HH:mm") === expiration_date ||
  date_time_today.isAfter(expiration_date);

console.log(isExpired);
