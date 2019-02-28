/*
beastify():
* удаляет каждый узел в document.body,
* затем вставляет выбранного зверя
* затем удаляется как слушатель
*/
function beastify(request, sender, sendResponse) {
    removeEverything();
    insertBeast(request.beastURL);
    browser.runtime.onMessage.removeListener(beastify);
}

/*
Удаляет каждый узел в document.body
*/
function removeEverything() {
    while (document.body.firstChild) {
        document.body.firstChild.remove();
    }
}

/*
Учитывая URL изображения зверя, создает и стилизует узел IMG,
указывающий на это изображение, затем вставляет узел в документ.
*/
function insertBeast(beastURL) {
    var beastImage = document.createElement("img");
    beastImage.setAttribute("src", beastURL);
    beastImage.setAttribute("style", "width: 100vw");
    beastImage.setAttribute("style", "height: 100vh");
    document.body.appendChild(beastImage);
}

/*
Назначает beastify() слушателем сообщений расширения.
*/
browser.runtime.onMessage.addListener(beastify);