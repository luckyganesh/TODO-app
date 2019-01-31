const changeStatus = function (status) {
  return status === 'Undone' ? 'Done' : 'Undone';
}

const toggleStatus = function () {
  const taskId = event.target.id
  fetch(`/${userId}/${todoId}/toggleTaskStatus`, {
    method: 'POST',
    body: JSON.stringify({ taskId })
  });
  const status = event.target.innerText;
  event.target.innerText = changeStatus(status);
}

const changeInnerText = function (element, innerText) {
  element.innerText = innerText;
  return element;
}

const submitTask = function () {
  const submitButton = event.target;
  const taskId = submitButton.id;
  const task = document.getElementById(taskId);
  const taskContent = task.value;
  fetch(`/${userId}/${todoId}/modifyTaskContent`, {
    method: 'POST',
    body: JSON.stringify({ taskId, taskContent })
  })
  const taskPara = createElement('p');
  taskPara.id = taskId;
  changeInnerText(taskPara, taskContent);
  task.replaceWith(taskPara);
  const editButton = changeInnerText(submitButton, 'edit');
  editButton.onclick = editTask;
}

const editTask = function () {
  const editButton = event.target;
  const id = editButton.id;
  const taskPara = document.getElementById(id);
  const taskInput = createElement('input');
  taskInput.id = id;
  taskInput.value = taskPara.innerText;
  taskPara.replaceWith(taskInput);
  const submitButton = changeInnerText(editButton, 'Submit');
  submitButton.onclick = submitTask;
}

const createTaskHtml = function (task) {
  const taskHtml = createElement('li');
  const buttonsHolder = createElement('p');
  const status = task.status ? 'Undone' : 'Done';
  const taskContent = createElementWithContent('p', task.content);
  const taskStatus = createButton(status);
  const editButton = createButton('Edit');
  const deleteButton = createButton('Delete');
  taskStatus.onclick = toggleStatus;
  deleteButton.onclick = deleteTask;
  editButton.onclick = editTask;
  placeAttribute('id', [taskContent, taskStatus, editButton, deleteButton], task.id);
  appendChilds(buttonsHolder, [taskStatus, editButton, deleteButton])
  appendChilds(taskHtml, [taskContent, buttonsHolder]);
  return taskHtml;
}

const createTasksHtml = function (tasks) {
  const tasksDiv = document.getElementById('tasks');
  tasksDiv.innerText = "";
  const tasksList = createElementWithId('ul', 'tasksList');
  const tasksHtml = tasks.reverse().map(createTaskHtml);
  appendChilds(tasksList, tasksHtml);
  tasksDiv.appendChild(tasksList);
}

const createDetailsHtml = function (details) {
  getElementOfId('title').value = details.title;
  getElementOfId('description').value = details.description;
}

const createTodoPage = function (todo) {
  createDetailsHtml(todo.details);
  createTasksHtml(todo.tasks);
}

const getTodo = function (todoId) {
  fetch(`/${userId}/getTodo`, {
    method: 'POST',
    body: JSON.stringify({ todoId })
  }).then(res => res.json())
    .then(todo => createTodoPage(todo));
}

const updateTasks = function () {
  fetch(`/${userId}/${todoId}/getTasks`, {
    method: 'POST',
    body: JSON.stringify({ todoId })
  }).then(res => res.json())
    .then(tasks => createTasksHtml(tasks));
}

const addTask = function () {
  const taskHolder = document.getElementById('newTask');
  const taskContent = taskHolder.value;
  if (taskContent === "") return;
  fetch(`/${userId}/${todoId}/addTask`, {
    method: 'POST',
    body: JSON.stringify({ taskContent })
  }).then(() => updateTasks());
  taskHolder.value = "";
}

const deleteTask = function () {
  const taskId = event.target.id
  fetch(`/${userId}/${todoId}/deleteTask`, {
    method: 'POST',
    body: JSON.stringify({ taskId })
  }).then(() => updateTasks());
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