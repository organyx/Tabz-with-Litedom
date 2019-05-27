import reLiftHTML from './relift.js';

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
    let getItemList = browser.storage.local.get();
    getItemList.then(items => {
      console.log(items);
      this.data.itemList = Object.values(items);
      console.log(this.data.itemList);
    }, onError);
  }
});
