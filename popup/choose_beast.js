var tabIcon = document.querySelector('.favicon');
var tabTitle = document.querySelector('.title');
var tabUrl = document.querySelector('.url');

/*
Учитывая имя зверя, получаем URL соответствующего изображения.
*/
function beastNameToURL(beastName) {
    switch (beastName) {
        case "Frog":
            return browser.extension.getURL("beasts/frog.jpg");
        case "Snake":
            return browser.extension.getURL("beasts/snake.jpg");
        case "Turtle":
            return browser.extension.getURL("beasts/turtle.jpg");
    }
}

function onCreated(tab) {
    console.log(`Created new tab: ${tab.id}`)
}

function onError(error) {
    console.log(`Error: ${error}`);
}

function createListElement(iconArg, titleArg, urlArg) {
    var img = document.createElement('img');
    var title = document.createElement('span');
    var url = document.createElement("span");
    var line = document.createElement('div');
    img.setAttribute('alt', 'icon');

    if (!iconArg) {
        img.setAttribute("src", "#");
    } else {
        img.setAttribute("src", iconArg);
    }
    img.setAttribute("class", "favicon");

    title.innerHTML = titleArg;
    title.setAttribute("class", "title");

    url.innerHTML = urlArg;
    url.setAttribute("class", "url");

    line.appendChild(img);
    line.appendChild(title);
    line.appendChild(url);
    line.setAttribute("class", "list-item");
    console.log(line);
    return line;
}

// initialize();

function initialize() {
    var getAllStoredTabs = browser.storage.local.get(null);
    getAllStoredTabs.then((results) => {
        var tabKeys = Object.keys(results);
        for (let tabKey of tabKeys) {
            var currentValue = results[tabKey];
            createListElement(tabKey, currentValue);
        }
    }, onError);
}

function addTab() {
    // TODO
    var tabIcon = this;
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

/*
Слушаем события клика во всплывающей панели.
  
Если кликнули одного из зверей:
  Добавляем "beastify.js" к активной вкладке.
  
  Затем получаем активную вкладку и отправляем сценарию "beastify.js"
  сообщение, содержащее URL к картинке с выбранным зверем.
  
Если кликнули кнопку, класс которой содержит "clear":
  Перезагрузить страницу.
  Закрыть всплывающую панель. Это необходимо, так как content script
  неисправен после перезагрузки страницы.  
*/

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("beast")) {
        var chosenBeast = e.target.textContent;
        var chosenBeastURL = beastNameToURL(chosenBeast);
        console.log(chosenBeastURL);
    }
    //     browser.tabs.executeScript(null, {
    //         file: "/content_scripts/beastify.js"
    //     });

    //     var gettingActiveTab = browser.tabs.query({
    //         active: true,
    //         currentWindow: true
    //     });
    //     gettingActiveTab.then((tabs) => {
    //         browser.tabs.sendMessage(tabs[0].id, {
    //             beastURL: chosenBeastURL
    //         });
    //     });
    // } else if (e.target.classList.contains("clear")) {
    //     browser.tabs.reload();
    //     window.close();
    // }

    if (e.target.classList.contains("list-item")) {
        var chosenItem = e.target;
        console.log(chosenItem);
        var newTab = browser.tabs.create({
            url: chosenItem.children[2].innerText
        });
        newTab.then(onCreated, onError);
    }

});

document.addEventListener("focus", (e) => {
    var gettingActiveTab = browser.tabs.query({
        active: true,
        currentWindow: true
    });
    gettingActiveTab.then((tabs) => {
        // console.log("THIS", tabs);
    })
    // console.log('THIS', browser.tabs);
});

document.addEventListener("focus", (e) => {

    var list = document.getElementById("list");
    var gettingActiveTab = browser.tabs.query({
        active: true,
        currentWindow: true
    });
    gettingActiveTab.then((tabs) => {
        // list.appendChild();
        list.appendChild(createListElement(tabs[0].favIconUrl, tabs[0].title, tabs[0].url));
    });
})