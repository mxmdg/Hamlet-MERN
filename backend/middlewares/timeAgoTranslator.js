// Load dependencies
const _ = require("lodash");
/***************************************************/

var settingsPast = {
  now: "Ahora",
  seconds: "%d hace unos segundos",
  minute: "hace un minuto",
  minutes: "hace %d minutos",
  hour: "hace una hora",
  hours: "hace %d horas",
  day: "hace un día",
  days: "hace %d días",
  month: "hace un mes",
  months: "hace %d meses",
  year: "hace un año",
  years: "hace %d años",
};

var settingsFurther = {
  now: "Ahora",
  seconds: "en %d segundo",
  minute: "en un minuto",
  minutes: "en %d minutos",
  hour: "en una hora",
  hours: "en %d horas",
  day: "en un día",
  days: "en %d días",
  month: "en un mes",
  months: "en %d meses",
  year: "en un año",
  years: "en %d años",
};

/***************************************************/

var inWords = function (inpDate) {
  // Get time distance from now (in milliseconds)
  var timeDist = new Date().getTime() - inpDate.getTime();

  // Get time components
  var seconds = timeDist / 1000;
  var minutes = seconds / 60;
  var hours = minutes / 60;
  var days = hours / 24;
  var years = days / 365;

  // Get string from number
  function getStrFromNum(string, number) {
    return string.replace(/%d/i, number);
  }

  // return words
  var words =
    (seconds < 30 && getStrFromNum(settingsPast.now, 0)) ||
    (seconds < 60 &&
      getStrFromNum(settingsPast.seconds, Math.round(seconds))) ||
    (seconds < 120 && getStrFromNum(settingsPast.minute, 1)) ||
    (minutes < 60 &&
      getStrFromNum(settingsPast.minutes, Math.round(minutes))) ||
    (minutes < 120 && getStrFromNum(settingsPast.hour, 1)) ||
    (hours < 24 && getStrFromNum(settingsPast.hours, Math.round(hours))) ||
    (hours < 48 && getStrFromNum(settingsPast.day, 1)) ||
    (days < 30 && getStrFromNum(settingsPast.days, Math.round(days))) ||
    (days < 60 && getStrFromNum(settingsPast.month, 1)) ||
    (days < 365 && getStrFromNum(settingsPast.months, Math.round(days / 30))) ||
    (years < 1.5 && getStrFromNum(settingsPast.year, 1)) ||
    getStrFromNum(settingsPast.years, Math.round(years));
  var futureWords =
    (seconds > -30 && getStrFromNum(settingsFurther.now, 0)) ||
    (seconds > -60 &&
      getStrFromNum(settingsFurther.seconds, Math.round(seconds) * -1)) ||
    (seconds > -120 && getStrFromNum(settingsFurther.minute, 1 * -1)) ||
    (minutes > -60 &&
      getStrFromNum(settingsFurther.minutes, Math.round(minutes) * -1)) ||
    (minutes > -120 && getStrFromNum(settingsFurther.hour, 1 * -1)) ||
    (hours > -24 &&
      getStrFromNum(settingsFurther.hours, Math.round(hours) * -1)) ||
    (hours > -48 && getStrFromNum(settingsFurther.day, 1 * -1)) ||
    (days > -30 &&
      getStrFromNum(settingsFurther.days, Math.round(days) * -1)) ||
    (days > -60 && getStrFromNum(settingsFurther.month, 1 * -1)) ||
    (days > -365 &&
      getStrFromNum(settingsFurther.months, Math.round(days / 30) * -1)) ||
    (years > -1.5 && getStrFromNum(settingsFurther.year, 1 * -1)) ||
    getStrFromNum(settingsFurther.years, Math.round(years) * -1);
  return timeDist > 0 ? words : futureWords;
};

/***************************************************/

var getAgoString = function (input) {
  if (input instanceof Date) {
    return inWords(input);
  } else if (typeof input === "number") {
    return inWords(new Date(input));
  } else if (
    typeof input === "string" &&
    new Date(input).toString() != "Invalid Date"
  ) {
    return inWords(new Date(input));
  } else {
    return input; // could not convert
  }
};

/***************************************************/

module.exports = exports = getAgoString;
