const changeStatus = function (status) {
  return status === 'Undone' ? 'Done' : 'Undone';
}

const toggleStatus = function () {
  const itemId = event.target.id
  fetch(`/${userId}/${todoId}/toggleItemStatus`, {
    method: 'POST',
    body: JSON.stringify({ itemId })
  });
  const status = event.target.innerText;
  event.target.innerText = changeStatus(status);
}

const changeInnerText = function (element, innerText) {
  element.innerText = innerText;
  return element;
}

const submitItem = function () {
  const submitButton = event.target;
  const itemId = submitButton.id;
  const item = document.getElementById(itemId);
  const itemContent = item.value;
  fetch(`/${userId}/${todoId}/modifyItemContent`, {
    method: 'POST',
    body: JSON.stringify({ itemId, itemContent })
  })
  const itemPara = createElement('p');
  itemPara.id = itemId;
  changeInnerText(itemPara, itemContent);
  item.replaceWith(itemPara);
  const editButton = changeInnerText(submitButton, 'edit');
  editButton.onclick = editItem;
}

const editItem = function () {
  const editButton = event.target;
  const id = editButton.id;
  const itemPara = document.getElementById(id);
  const itemInput = createElement('input');
  itemInput.id = id;
  itemInput.value = itemPara.innerText;
  itemPara.replaceWith(itemInput);
  const submitButton = changeInnerText(editButton, 'Submit');
  submitButton.onclick = submitItem;
}

const createItemHtml = function (item) {
  const itemHtml = createElement('li');
  const buttonsHolder = createElement('p');
  const status = item.status ? 'Undone' : 'Done';
  const itemContent = createElementWithContent('p', item.content);
  const itemStatus = createButton(status);
  const editButton = createButton('Edit');
  const deleteButton = createButton('Delete');
  itemStatus.onclick = toggleStatus;
  deleteButton.onclick = deleteItem;
  editButton.onclick = editItem;
  placeAttribute('id', [itemContent, itemStatus, editButton, deleteButton], item.id);
  appendChilds(buttonsHolder, [itemStatus, editButton, deleteButton])
  appendChilds(itemHtml, [itemContent, buttonsHolder]);
  return itemHtml;
}

const createItemsHtml = function (items) {
  const itemsDiv = document.getElementById('items');
  itemsDiv.innerText = "";
  const itemsLabel = createElementWithContent('h3', 'Items')
  itemsDiv.appendChild(itemsLabel);
  const itemsList = createElementWithId('ul', 'itemsList');
  const itemsHtml = items.reverse().map(createItemHtml);
  appendChilds(itemsList, itemsHtml);
  itemsDiv.appendChild(itemsList);
}

const createDetailsHtml = function (details) {
  getElementOfId('title').value = details.title;
  getElementOfId('description').value = details.description;
}

const createTodoPage = function (todo) {
  createDetailsHtml(todo.details);
  createItemsHtml(todo.items);
}

const getTodo = function (todoId) {
  fetch(`/${userId}/getTodo`, {
    method: 'POST',
    body: JSON.stringify({ todoId })
  }).then(res => res.json())
    .then(todo => createTodoPage(todo));
}

const updateItems = function () {
  fetch(`/${userId}/${todoId}/getItems`, {
    method: 'POST',
    body: JSON.stringify({ todoId })
  }).then(res => res.json())
    .then(items => createItemsHtml(items));
}

const addItem = function () {
  const itemHolder = document.getElementById('newItem');
  const itemContent = itemHolder.value;
  if (itemContent === "") return;
  fetch(`/${userId}/${todoId}/addItem`, {
    method: 'POST',
    body: JSON.stringify({ itemContent })
  }).then(() => updateItems());
  itemHolder.value = "";
}

const deleteItem = function () {
  const itemId = event.target.id
  fetch(`/${userId}/${todoId}/deleteItem`, {
    method: 'POST',
    body: JSON.stringify({ itemId })
  }).then(() => updateItems());
}

const updateDetails = function () {
  fetch(`/${userId}/${todoId}/getDetails`, {
    method: 'POST',
    body: JSON.stringify({ todoId })
  }).then(res => res.json())
    .then(details => createDetailsHtml(details));
}

const modifyTodoDetails = function () {
  const newTitle = getElementOfId('title').value;
  const newDescription = getElementOfId('description').value;
  if (newTitle === "") {
    updateDetails();
    return;
  }
  fetch(`/${userId}/${todoId}/modifyTodoDetails`, {
    method: 'POST',
    body: JSON.stringify({ newTitle, newDescription })
  }).then(res => updateDetails());
}

const initialize = function () {
  createHeader();
  getTodo(todoId);
}

window.onload = initialize;