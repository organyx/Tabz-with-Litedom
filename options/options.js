function onSetTimer() {
  console.log('Timer Set');
}

function onError(error) {
  console.log(error);
}

function saveGlobalTimer(e) {
  if (e.target.id === 'btn-set-global-timer') {
    var saveGlobalTimer = browser.storage.sync.set({
      timer: (selectTimer = document.getElementById('timers').value)
    });
    saveGlobalTimer.then(onSetTimer, onError);
    // restoreOptions();
  }
}

function test(e) {
  var selectTimer = document.getElementById('timers').value;
  console.log(selectTimer);
}

function restoreOptions() {
  var storedTimer = browser.storage.sync.get('timer');
  storedTimer.then(timer => {
    var sendMessage = browser.runtime.sendMessage({ timer: timer });
    sendMessage.then(response => {
      console.log('BG Response: ', response);
    }, onError);
  }, onError);
}

browser.runtime.onStartup.addListener(restoreOptions);
document.addEventListener('click', saveGlobalTimer);
