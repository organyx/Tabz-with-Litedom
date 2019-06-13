import reLiftHTML from '../popup/relift.js';

reLiftHTML({
  el: '#root',
  data: {
    timer: '',
    displayTimer: []
  },
  created() {
    console.log('Created ', this.data.timer);
    var storedTimer = browser.storage.sync.get('timer');
    storedTimer.then(timer => {
      this.data.timer = timer;
      this.data.displayTimer = Object.values(timer);
      var sendMessage = browser.runtime.sendMessage({ timer: timer });
      sendMessage.then(response => {
        console.log('BG Response: ', response);
      }, onError);
    }, onError);
  },
  setTimer(event) {
    console.log('Timer', this.data.timer);
    var saveGlobalTimer = browser.storage.sync.set({
      timer: this.data.timer
    });
    saveGlobalTimer.then(() => {
      this.data.displayTimer = this.data.timer;
      console.log('Display Timer ', this.data.displayTimer);
    }, onError);
  },
  getTimer(event) {
    var storedTimer = browser.storage.sync.get('timer');
    storedTimer.then(timer => {
      console.log('getTimer ', timer);
    }, onError);
  }
});

function onError(error) {
  console.log(error);
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
