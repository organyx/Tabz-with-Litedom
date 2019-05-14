// Open New Tab Event Listener
document.addEventListener('click', openNewTab);
// Add Current Tab to the list Event Listener
document.addEventListener('click', addCurrentTabToTheList);
// Get Tab list Event Listener
document.addEventListener('click', getTabList);
// Clear Tab list Event Listener
document.addEventListener('click', clearTabList);
// Close Single Tab Event Listener
document.addEventListener('click', closeSingleTab);
// Move Selected Tab to Bookmarks Event Listener
document.addEventListener('click', moveSelectedTabToBookmarks);
// Add All open Tabs to the list Event Listener
document.addEventListener('click', addAllOpenTabsToTheList);
// Load Initial Data Event Listener
document.addEventListener('DOMContentLoaded', init);

function onCreated(tab) {
  console.log('onCreated', `Created new tab: ${tab.id}`);
}

function setTab() {
  console.log('setTab', 'Tab Set');
  refreshTabList();
}

function onGotItem(item) {
  console.log('onGotItem', item);
}

function onCleared() {
  console.log('onCleared', 'All Tabs Cleared');
  refreshTabList();
}

function onRemoved() {
  console.log('onRemoved', 'Tab Removed');
  refreshTabList();
}

function onError(error) {
  console.log(`Error: ${error}`);
}

function createListElement(titleArg, urlArg, iconArg) {
  // Tab Information
  var img = document.createElement('img');
  var title = document.createElement('span');
  var url = document.createElement('span');
  var tabInfo = document.createElement('div');
  // Tab Delete Button
  var btnDeleteTab = document.createElement('img');
  // Tab Move Button
  var btnMoveTab = document.createElement('img');
  // Tab ID
  var tabId = document.createElement('input');
  // Tab Actions
  var tabActions = document.createElement('div');
  // General Container
  var tab = document.createElement('div');

  img.setAttribute('alt', 'icon');

  if (!iconArg) {
    img.setAttribute('src', '#');
  } else {
    img.setAttribute('src', iconArg);
  }
  img.setAttribute('class', 'favicon');

  title.innerHTML = titleArg;
  title.setAttribute('class', 'title');

  url.innerHTML = urlArg;
  url.setAttribute('class', 'url');

  btnDeleteTab.setAttribute('class', 'btn-close-tab');
  btnDeleteTab.setAttribute('src', '/icons/outline_close_black_18dp.png');
  btnDeleteTab.setAttribute('title', 'Remove This Tab from the list');

  btnMoveTab.setAttribute('class', 'btn-move-tab');
  btnMoveTab.setAttribute(
    'src',
    '/icons/outline_bookmark_border_black_18dp.png'
  );
  btnMoveTab.setAttribute(
    'title',
    'Add This Tab to Bookmarks and Delete it from the list'
  );

  tabId.setAttribute('type', 'hidden');
  tabId.setAttribute('name', 'tabId');
  tabId.value = titleArg;

  tabInfo.appendChild(img);
  tabInfo.appendChild(title);
  tabInfo.appendChild(url);
  tabInfo.setAttribute('class', 'list-item tab-info');

  tabActions.appendChild(btnDeleteTab);
  tabActions.appendChild(btnMoveTab);
  tabActions.appendChild(tabId);
  tabActions.setAttribute('class', 'tab-actions');

  tab.appendChild(tabInfo);
  tab.appendChild(tabActions);
  tab.setAttribute('class', 'parent');

  return tab;
}

function getAllTabs() {
  var getAllStoredTabs = browser.storage.local.get(null);
  getAllStoredTabs.then(results => {
    var list = document.getElementById('list');

    for (const key in results) {
      if (results.hasOwnProperty(key)) {
        const element = results[key];
        var newTabLine = createListElement(
          element.title,
          element.url,
          element.icon
        );
        list.appendChild(newTabLine);
      }
    }
  }, onError);
}

function refreshTabList() {
  var list = document.getElementById('list');
  while (list.hasChildNodes()) {
    list.removeChild(list.firstChild);
  }
  getAllTabs();
}

// Open a new Tab
function openNewTab(e) {
  if (e.target.parentElement.classList.contains('list-item')) {
    var parent = e.target.parentElement;
    var newTab = browser.tabs.create({
      url: parent.children[2].innerText
    });
    newTab.then(onCreated, onError);
    console.log(parent);
  }
}
// Add Current Tab to the list
function addCurrentTabToTheList(e) {
  if (e.target.classList.contains('add-tab')) {
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
      var insertTab = browser.storage.local.set({
        [relevantInfo.title]: relevantInfo
      });
      insertTab.then(setTab, onError);
    });
  }
}
// Get Tab List
function getTabList(e) {
  if (e.target.classList.contains('check-tab')) {
    let getItemList = browser.storage.local.get();
    getItemList.then(onGotItem, onError);
  }
}
// Clear Tab List
function clearTabList(e) {
  if (e.target.classList.contains('clear-tab')) {
    var clearStorage = browser.storage.local.clear();
    clearStorage.then(onCleared, onError);
  }
}
// Close single Tab
function closeSingleTab(e) {
  if (e.target.classList.contains('btn-close-tab')) {
    var tabId = e.target.parentElement.lastChild.value;
    var removeTab = browser.storage.local.remove(tabId);
    removeTab.then(onRemoved, onError);
  }
}
// Move selected Tab to Bookmarks
function moveSelectedTabToBookmarks(e) {
  if (e.target.classList.contains('btn-move-tab')) {
    var tabId = e.target.nextSibling.value;
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
          removeTab.then(onRemoved, onError);
        }, onError);
      }, onError);
    }
  }
}
// Add all open Tabs to the list
function addAllOpenTabsToTheList(e) {
  if (e.target.classList.contains('add-all-tabs')) {
    var allTabs = browser.tabs.query({});
    allTabs.then(tabs => {
      if (tabs) {
        // console.log(tabs);
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
        refreshTabList();
      }
    }, onError);
  }
}
// Initialize
function init(e) {
  var gettingActiveTab = browser.tabs.query({
    active: true,
    currentWindow: true
  });
  gettingActiveTab.then(tabs => {
    getAllTabs();
  }, onError);
}
