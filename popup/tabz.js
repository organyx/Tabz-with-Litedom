function onCreated(tab) {
  console.log('onCreated', `Created new tab: ${tab.id}`);
}

function setItem() {
  console.log('setItem', 'Item Set');
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
  // console.log('createListElement()');
  // Tab Information
  var img = document.createElement('img');
  var title = document.createElement('span');
  var url = document.createElement('span');
  var tabInfo = document.createElement('div');
  // Tab Delete Button
  var btnDeleteTab = document.createElement('img');
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

  tabId.setAttribute('type', 'hidden');
  tabId.setAttribute('name', 'tabId');
  tabId.value = titleArg;

  tabInfo.appendChild(img);
  tabInfo.appendChild(title);
  tabInfo.appendChild(url);
  tabInfo.setAttribute('class', 'list-item');

  tabActions.appendChild(btnDeleteTab);
  tabActions.appendChild(tabId);

  tab.setAttribute('class', 'tab');
  tab.appendChild(tabActions);
  tab.appendChild(tabInfo);

  console.log(tab);
  return tab;
}

function initialize() {
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
  initialize();
}

document.addEventListener('click', e => {
  if (e.target.parentElement.classList.contains('list-item')) {
    var parent = e.target.parentElement;
    var newTab = browser.tabs.create({
      url: parent.children[2].innerText
    });
    newTab.then(onCreated, onError);
    console.log(parent);
  }
});

document.addEventListener('click', e => {
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
      insertTab.then(setItem, onError);
    });
  }
});

document.addEventListener('click', e => {
  if (e.target.classList.contains('check-tab')) {
    let getItemList = browser.storage.local.get();
    getItemList.then(onGotItem, onError);
  }
});

document.addEventListener('click', e => {
  if (e.target.classList.contains('clear-tab')) {
    var clearStorage = browser.storage.local.clear();
    clearStorage.then(onCleared, onError);
  }
});

document.addEventListener('click', e => {
  if (e.target.classList.contains('btn-close-tab')) {
    var tabId = e.target.nextSibling.value;
    console.log(tabId);
    var removeTab = browser.storage.local.remove(tabId);
    removeTab.then(onRemoved, onError);
  }
});

document.addEventListener('click', e => {
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
});

document.addEventListener('DOMContentLoaded', e => {
  // var list = document.getElementById('list');
  var gettingActiveTab = browser.tabs.query({
    active: true,
    currentWindow: true
  });
  gettingActiveTab.then(tabs => {
    initialize();
  }, onError);
});
