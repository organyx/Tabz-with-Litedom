import Litedom from '../litedom/litedom.es.js';

function onError(error) {
  console.log(`Error: ${error}`);
}

Litedom({
  el: '#root',
  data: {
    world: 'World this is me',
    itemList: []
  },
  created() {
    console.log('Created');
    let getItemList = browser.storage.local.get();
    getItemList.then(items => {
      console.log(items);
      this.data.itemList = Object.values(items);
      console.log(this.data.itemList);
    }, onError);
  },
  updated() {
    console.log('Updated');
  },
  addCurrentTabToTheList(event) {
    var relevantInfo = {};
    var gettingActiveTab = browser.tabs.query({
      active: true,
      currentWindow: true
    });
    gettingActiveTab.then(tabs => {
      if (this.isValidIcon(tabs[0].favIconUrl)) {
        relevantInfo = {
          title: tabs[0].title,
          url: tabs[0].url,
          icon: tabs[0].favIconUrl
        };
      } else {
        relevantInfo = {
          title: tabs[0].title,
          url: tabs[0].url,
          icon: '../icons/outline_tab_black_18dp.png'
        };
      }
      console.log(relevantInfo);
      var insertTab = browser.storage.local.set({
        [relevantInfo.title]: relevantInfo
      });
      insertTab.then(() => {
        console.log('setTab', 'Tab Set');
        this.refreshTabList(event);
      }, onError);
    });
  },
  addAllOpenTabsToTheList(event) {
    var allTabs = browser.tabs.query({});
    allTabs.then(tabs => {
      if (tabs) {
        tabs.forEach(element => {
          var item = {};
          if (this.isValidIcon(element.favIconUrl)) {
            item = {
              [element.title]: {
                title: element.title,
                url: element.url,
                icon: element.favIconUrl
              }
            };
          } else {
            item = {
              [element.title]: {
                title: element.title,
                url: element.url,
                icon: '../icons/outline_tab_black_18dp.png'
              }
            };
          }
          var insertTab = browser.storage.local.set(item).then(() => {
            console.log('Tab added');
          }, onError);
        });
        this.refreshTabList(event);
      }
    }, onError);
  },
  refreshTabList(event) {
    browser.storage.local.get().then(items => {
      this.data.itemList = Object.values(items);
    }, onError);
  },
  clearTabList(event) {
    var clearStorage = browser.storage.local.clear();
    clearStorage.then(() => {
      this.refreshTabList(event);
    }, onError);
  },
  openNewTab(event) {
    var parent = event.target.parentElement;
    // console.log(parent);
    var newTab = browser.tabs.create({
      url: parent.children[2].innerText
    });
    newTab.then(() => {
      console.log('New Tab', 'Opened');
    }, onError);
  },
  openOptions(event) {
    browser.runtime.openOptionsPage();
  },
  moveSelectedTabToBookmarks(event) {
    var tabId = event.target.parentElement.lastElementChild.value;
    // Create confirmation dialog
    var confirmMove = confirm(
      'Would you like to save this tab as a bookmark and close the tab?'
    );
    if (confirmMove) {
      // If confirmed get tab information promise
      var getTabInfo = browser.storage.local.get(tabId);
      // Execute get information pormise
      getTabInfo.then(tab => {
        var getBookmarkFolderId = browser.storage.sync.get('bookmarkFolderId');
        getBookmarkFolderId.then(options => {
          // Create a new bookmark promise with tab information
          var createBookmark = browser.bookmarks.create({
            parentId: options.bookmarkFolderId,
            title: tab[tabId].title,
            url: tab[tabId].url
          });
          // Execute create new bookmark pormise
          createBookmark.then(node => {
            console.log('New Bookmark: ', node);
            // Create remove tab promise
            var removeTab = browser.storage.local.remove(tabId);
            // Execute remove tab promise
            removeTab.then(() => {
              this.refreshTabList(event);
            }, onError);
          });
        }, onError);
      }, onError);
    }
  },
  closeSingleTab(event) {
    var tabId = event.target.parentElement.lastElementChild.value;
    var removeTab = browser.storage.local.remove(tabId);
    removeTab.then(() => {
      this.refreshTabList(event);
    }, onError);
  },
  isValidIcon(iconUrl) {
    var isGood = /chrome/.test(iconUrl);
    return iconUrl !== undefined && !isGood;
  }
});
