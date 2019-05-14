var bookmarkFolderId;

function onError(error) {
  console.log(`An error: ${error}`);
}

function storeAllTabsAsBookmarks() {
  let getItemList = browser.storage.local.get();
  getItemList.then(tabs => {
    for (const tab in tabs) {
      if (tabs.hasOwnProperty(tab)) {
        const element = tabs[tab];
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
  }, onError);
}

function cleanUpBookmarks() {
  storeAllTabsAsBookmarks();
}

browser.alarms.create('cleanupTime', {
  delayInMinutes: 0.5,
  periodInMinutes: 0.1
});

browser.alarms.onAlarm.addListener(alarmInfo => {
  if (alarmInfo.name === 'cleanupTime') cleanUpBookmarks();
});

function createTabsFolderForBookmarks(e) {
  var checkIfBookmarkFolderExists = browser.bookmarks.search({
    title: 'TabZZZ'
  });
  checkIfBookmarkFolderExists.then(node => {
    if (node.length > 0) {
      bookmarkFolderId = node[0].id;
      console.log('Bookmark folder already exists', bookmarkFolderId);
    } else {
      var createBookmarkFolder = browser.bookmarks.create({
        title: 'TabZZZ'
      });
      createBookmarkFolder.then(node => {
        bookmarkFolderId = node[0].id;
        console.log('Bookmark folder created', node);
      }, onError);
    }
  }, onError);
}

browser.runtime.onInstalled.addListener(createTabsFolderForBookmarks);
