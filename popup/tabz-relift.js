import reLiftHTML from './relift.js';

function setTab() {
  console.log('setTab', 'Tab Set');
  // refreshTabList();
}

function onGotItem(item) {
  console.log('onGotItem', item);
}

function onError(error) {
  console.log(`Error: ${error}`);
}

reLiftHTML({
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
    // let getItemList = browser.storage.local.get();
    // getItemList.then(items => {
    //   console.log(items);
    //   this.data.itemList = Object.values(items);
    //   console.log(this.data.itemList);
    // }, onError);
    // this.render();
    console.log('Updated');
  },
  addCurrentTabToTheList(event) {
    var relevantInfo = {};
    var gettingActiveTab = browser.tabs.query({
      active: true,
      currentWindow: true
    });
    gettingActiveTab.then(tabs => {
      relevantInfo = {
        title: tabs[0].title,
        url: tabs[0].url,
        icon: tabs[0].favIconUrl
      };
      console.log(relevantInfo);
      var insertTab = browser.storage.local.set({
        [relevantInfo.title]: relevantInfo
      });
      insertTab.then(() => {
        console.log('setTab', 'Tab Set');
        // this.render();
        browser.storage.local.get().then(items => {
          this.data.itemList = Object.values(items);
        }, onError);
      }, onError);
    });
  },
  addAllOpenTabsToTheList(event) {
    var allTabs = browser.tabs.query({});
    allTabs.then(tabs => {
      if (tabs) {
        tabs.forEach(element => {
          var insertTab = browser.storage.local
            .set({
              [element.title]: {
                title: element.title,
                url: element.url,
                icon: element.favIconUrl
              }
            })
            .then(() => {
              console.log('Tab added');
            }, onError);
        });
        browser.storage.local.get().then(items => {
          this.data.itemList = Object.values(items);
        }, onError);
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
      browser.storage.local.get().then(items => {
        this.data.itemList = Object.values(items);
      }, onError);
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
        // Create a new bookmark promise with tab information
        var createBookmark = browser.bookmarks.create({
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
            browser.storage.local.get().then(items => {
              this.data.itemList = Object.values(items);
            }, onError);
          }, onError);
        }, onError);
      }, onError);
    }
  },
  closeSingleTab(event) {
    var tabId = event.target.parentElement.lastElementChild.value;
    var removeTab = browser.storage.local.remove(tabId);
    removeTab.then(() => {
      browser.storage.local.get().then(items => {
        this.data.itemList = Object.values(items);
      }, onError);
    }, onError);
  }
});
