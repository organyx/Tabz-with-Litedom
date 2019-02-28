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

function createListElement(iconArg, titleArg, urlArg) {
    var img = document.createElement('img');
    var title = document.createElement('div');
    var url = document.createElement("div");
    var line = document.createElement('div');
    img.setAttribute('height', 42);
    img.setAttribute('width', 42);
    img.setAttribute('alt', 'icon');

    if (!iconArg) {
        img.setAttribute("src", "#");
    } else {
        img.setAttribute("src", iconArg);
    }

    img.setAttribute("src", iconArg);
    title.innerHTML = titleArg;
    url.innerHTML = urlArg;
    line.appendChild(img);
    line.appendChild(title);
    line.appendChild(url);
    console.log(line);
    return line;
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

        browser.tabs.executeScript(null, {
            file: "/content_scripts/beastify.js"
        });

        var gettingActiveTab = browser.tabs.query({
            active: true,
            currentWindow: true
        });
        gettingActiveTab.then((tabs) => {
            browser.tabs.sendMessage(tabs[0].id, {
                beastURL: chosenBeastURL
            });
        });
    } else if (e.target.classList.contains("clear")) {
        browser.tabs.reload();
        window.close();
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