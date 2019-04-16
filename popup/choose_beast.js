function onCreated(tab) {
  console.log(`Created new tab: ${tab.id}`);
}

function setItem() {
  console.log('Item Set');
}

function onGotItem(item) {
  console.log(item);
}

function onCleared() {
  console.log('Tabs Cleared');
}

function onError(error) {
  console.log(`Error: ${error}`);
}

function createListElement(titleArg, urlArg, iconArg) {
  console.log('createListElement()');
  var img = document.createElement('img');
  var title = document.createElement('span');
  var url = document.createElement('span');
  var line = document.createElement('div');
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

  line.appendChild(img);
  line.appendChild(title);
  line.appendChild(url);
  line.setAttribute('class', 'list-item');
  console.log(line);
  return line;
}

// initialize();

function initialize() {
  var getAllStoredTabs = browser.storage.local.get(null);
  getAllStoredTabs.then(results => {
    var tabKeys = Object.keys(results);
    // for (let tabKey of tabKeys) {
    //   var currentValue = results[tabKey];
    //   // createListElement(tabKey, currentValue);
    //   // console.log(tabKeys);
    // }
    // var tabIcon = results[tabKeys[0]];
    // var tabTitle = results[tabKeys[1]];
    // var tabUrl = results[tabKeys[2]];
    // // console.log(tabUrl);
    // createListElement(tabIcon, tabTitle, tabUrl);
    for (const key in results) {
      if (results.hasOwnProperty(key)) {
        const element = results[key];
        // console.log(element);
        var newTabLine = createListElement(element.title, element.url, element.icon);
        // addTab(element.title, element.url, element.icon);
      }
    }
    // console.log(results);
  }, onError);
}

function addTab(title, url, icon) {
  console.log('addTab()');
  var tabIcon = icon;
  var tabTitle = title;
  var tabUrl = url;
  var settingTab = browser.storage.local.set({
    tabTitle,
    tabUrl,
    tabIcon
  });
  settingTab.then(() => {
    console.log('addTab(), Promise');
    var newTabLine = createListElement(tabTitle, tabUrl, tabIcon);
    // initialize();
  }, onError);
}

function storeTab() {
  //TODO
}

function deleteTab(deleteTab, newTitle, newBody) {
  var storingTab = browser.storage.local.set({
    [newTitle]: newBody
  });
  storingTab.then(() => {
    // TO DO
  });
}

function purgeTabs() {
  // var
}

document.addEventListener('click', e => {
  if (e.target.classList.contains('list-item')) {
    var chosenItem = e.target;
    console.log(chosenItem);
    var newTab = browser.tabs.create({
      url: chosenItem.children[2].innerText
    });
    newTab.then(onCreated, onError);
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

document.addEventListener('DOMContentLoaded', e => {
  var list = document.getElementById('list');
  var gettingActiveTab = browser.tabs.query({
    active: true,
    currentWindow: true
  });
  gettingActiveTab.then(tabs => {
    // list.appendChild();
    // list.appendChild(
    //   createListElement(tabs[0].favIconUrl, tabs[0].title, tabs[0].url)
    // );
    // addTab(tabs[0].favIconUrl, tabs[0].title, tabs[0].url);
    initialize();
  }, onError);
});

// document.addEventListener('DOMContentLoaded', e => {
//   var list = document.getElementById('list');
//   var gettingActiveTab = browser.tabs.query({
//     active: true,
//     currentWindow: true
//   });
//   gettingActiveTab.then(tabs => {
//     // list.appendChild();
//     list.appendChild(
//       createListElement(tabs[0].favIconUrl, tabs[0].title, tabs[0].url)
//     );
//     // addTab(tabs[0].favIconUrl, tabs[0].title, tabs[0].url);
//   });
// });
