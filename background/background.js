function cleanUpBookmarks() {
  console.log('TIME TO CLEAN THIS UP');
}

browser.alarms.create('cleanupTime', {
//   delayInMinutes: 1,
  periodInMinutes: 1
});

browser.alarms.onAlarm.addListener(alarmInfo => {
  console.log('Alarm Time');
  console.log(alarmInfo);
  if (alarmInfo.name === 'cleanupTime') cleanUpBookmarks();
});
