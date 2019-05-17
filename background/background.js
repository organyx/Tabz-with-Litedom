var bookmarkFolderId;
var globalTimer = 720;

function onError(error) {
  console.log(`An error: ${error}`);
}

function is_url(str) {
  regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

  return regexp.test(str) ? true : false;
}

function storeAllTabsAsBookmarks() {
  let getItemList = browser.storage.local.get();
  getItemList.then(tabs => {
    for (const tab in tabs) {
      if (tabs.hasOwnProperty(tab)) {
        const element = tabs[tab];
        if (is_url(element.url)) {
          var exists = browser.bookmarks.search({ url: element.url });
          exists.then(bookmarkItems => {
            if (bookmarkItems.length > 0) {
              console.log('Item Already Bookmarked');
            } else {
              var createBookmark = browser.bookmarks.create({
                parentId: bookmarkFolderId,
                title: element.title,
                url: element.url
              });
              createBookmark.then(node => {
                console.log(node);
              }, onError);
            }
          }, onError);
        }
      }
    }
    clearStorage();
  }, onError);
}

function clearStorage() {
  browser.storage.local.clear().then(() => {
    console.log('All Tabs were stored as bookmarks');
  }, onError);
}

function cleanUpBookmarks() {
  storeAllTabsAsBookmarks();
}

browser.alarms.create('cleanupTime', {
  delayInMinutes: 150,
  periodInMinutes: globalTimer
});

browser.alarms.onAlarm.addListener(alarmInfo => {
  if (alarmInfo.name === 'cleanupTime') cleanUpBookmarks();
});

function createTabsFolderForBookmarks(e) {
  var checkIfBookmarkFolderExists = browser.bookmarks.search({
    title: 'TabZ'
  });
  checkIfBookmarkFolderExists.then(node => {
    if (node.length > 0) {
      bookmarkFolderId = node[0].id;
      console.log('Bookmark folder already exists', bookmarkFolderId);
    } else {
      console.log('Folder will be created');
      var createBookmarkFolder = browser.bookmarks.create({
        title: 'TabZ'
      });
      createBookmarkFolder.then(node => {
        // console.log(node);
        bookmarkFolderId = node.id;
        console.log('Bookmark folder created', bookmarkFolderId);
      });
    }
  }, onError);
}

browser.runtime.onInstalled.addListener(createTabsFolderForBookmarks);

function handleMessage(request, sender, sendResponse) {
  console.log('received msg:', request.timer);
  globalTimer = request.timer;
  sendResponse({ response: 'all good' });
}

browser.runtime.onMessage.addListener(handleMessage);
