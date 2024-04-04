const hourInDay = 24;
const minutesInDay = hourInDay * 60;
const secondsInDay = minutesInDay * 60;
const millisecondsInDay = secondsInDay * 1000;

const daysToMilliseconds = (days) => {
 return days * millisecondsInDay;
}

module.exports = { daysToMilliseconds };