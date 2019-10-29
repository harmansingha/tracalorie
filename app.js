//Item Controller
const ItemCtrl = (function () {

  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  const data = {
    items: [],
    totalCalories: 0,
    currentItem: null
  }

  //Public Methods
  return {
    getAllItems: function () {
      return data.items;
    },
    getItemDetails: function (id) {
      data.currentItem = data.items.filter(item => item.id === parseInt(id))[0];
      return data.currentItem;
    },
    addItem: function (name, calories) {
      let id = 1;

      if (data.items.length) {
        id = data.items[data.items.length - 1].id + 1;
      }

      const newItem = new Item(parseInt(id), name, calories);

      data.items.push(newItem);

      //Update Calories
      data.totalCalories = parseInt(data.totalCalories) + parseInt(calories);
      return newItem;
    },
    getTotalCalories: function () {
      return data.totalCalories;
    },
    resetEditItem: function () {
      data.currentItem = null;
    },
    deleteItem: function (id) {
      const items = data.items.filter(item => item.id !== parseInt(id));
      data.items = items;
    }
  }
})();

//UI Controller
const UICtrl = (function () {

  const UISelectors = {
    itemsList: '#item-list',
    addItem: '.add-btn',
    itemName: '#item-name',
    itemCalories: '#item-calories',
    totalCalories: '.total-calories',
    updateBtn: '.update-btn',
    cancelBtn: '.cancel-btn'
  }

  const UIControls = {
    btnAddItem: document.querySelector(UISelectors.addItem),
    ulItems: document.querySelector(UISelectors.itemsList),
    txtName: document.querySelector(UISelectors.itemName),
    txtCalories: document.querySelector(UISelectors.itemCalories),
    lblTotalCalories: document.querySelector(UISelectors.totalCalories),
    btnUpdate: document.querySelector(UISelectors.updateBtn),
    btnCancel: document.querySelector(UISelectors.cancelBtn)
  }

  return {
    populateItems: function (items) {

      UIControls.btnUpdate.style.display = 'none';
      UIControls.btnCancel.style.display = 'none';

      let html = '';

      items.forEach(item => {
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}</strong> <em>${item.calories} Calories</em>
        <a href="#" class="delete-item secondary-content"
          ><i class="material-icons">delete</i></a>
        <a href="#" class="edit-item secondary-content"
          ><i class="material-icons">edit</i></a>
      </li>`
      });

      UIControls.ulItems.innerHTML = html;
    },
    getSelectors: function () {
      return UISelectors;
    },
    getFormInput: function () {
      return {
        name: UIControls.txtName.value,
        calories: UIControls.txtCalories.value
      }
    },
    addItemToList: function (item) {
      const li = document.createElement('li');
      li.className = "collection-item";
      li.id = "item-" + item.id;
      li.innerHTML = `
        <strong>${item.name}</strong> <em>${item.calories} Calories</em>
        <a href="#" class="delete-item secondary-content"
          ><i class="delete-item material-icons">delete</i></a>
        <a href="#" class="edit-item secondary-content"
          ><i class="edit-item material-icons">edit</i></a>
        `;

      UIControls.ulItems.appendChild(li);
      this.clearFormFields();
    },
    clearFormFields: function () {
      UIControls.txtName.value = '';
      UIControls.txtCalories.value = ''
    },
    updateTotalCalories: function (totalCalories) {
      UIControls.lblTotalCalories.innerHTML = totalCalories;
    },
    getUIControls: function () {
      return UIControls;
    },
    populateInputFieldsForEdit: function (name, calories) {
      UIControls.txtName.value = name;
      UIControls.txtCalories.value = calories;
      UIControls.btnAddItem.style.display = 'none';
      UIControls.btnUpdate.style.display = 'inline';
      UIControls.btnCancel.style.display = 'inline';
    },
    resetUIFields: function () {
      this.clearFormFields();
      UIControls.btnAddItem.style.display = 'inline';
      UIControls.btnUpdate.style.display = 'none';
      UIControls.btnCancel.style.display = 'none';
    },
    removeItemList: function (e) {
      e.target.parentNode.parentNode.remove();
    }
  }

})();




//App
const App = (function (ItemCtrl, UICtrl) {

  const UIControls = UICtrl.getUIControls();

  const loadEventListeners = function () {
    UIControls.btnAddItem.addEventListener('click', addItemSubmit);
    UIControls.ulItems.addEventListener('click', editDeleteItem);
    UIControls.btnCancel.addEventListener('click', cancelEditItem);
  }

  //Add Item Submit
  const addItemSubmit = function (e) {
    e.preventDefault();
    const input = UICtrl.getFormInput();
    const newItem = ItemCtrl.addItem(input.name, input.calories);
    UICtrl.addItemToList(newItem);
    UICtrl.updateTotalCalories(ItemCtrl.getTotalCalories());
  }

  //Edit Delete Item Click
  const editDeleteItem = function (e) {
    e.preventDefault();

    if (e.target.classList.contains('edit-item')) {
      let id = e.target.parentNode.parentNode.id;
      id = id.split('-')[1];

      //Fetch Item Details
      const item = ItemCtrl.getItemDetails(id);

      //Fill Inputs
      UICtrl.populateInputFieldsForEdit(item.name, item.calories);
    }
    else if (e.target.classList.contains('delete-item')) {
      let id = e.target.parentNode.parentNode.id;
      id = id.split('-')[1];

      ItemCtrl.deleteItem(id);
      UICtrl.removeItemList(e);
    }
  }

  //Cancel Edit Item Click
  const cancelEditItem = (e) => {
    e.preventDefault();
    ItemCtrl.resetEditItem();
    UICtrl.resetUIFields();
  }

  return {
    init: function () {
      //Fetch Items from Item Controller
      const items = ItemCtrl.getAllItems();

      //Populate Items to the UI on page load
      UICtrl.populateItems(items);

      loadEventListeners();
    }
  }

})(ItemCtrl, UICtrl);

App.init();