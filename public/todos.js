const formTemplate = `<form id="form">
<p>
  <label>Title : </label>
  <input type="text" name="title">
</p>
<p>
  <label>Description : </label>
  <textarea name="description" rows="3" cols="50"></textarea>
</p>
<input type="button" value="submit" onclick="addTodo()">
<input type="reset" value="reset">
<input type="button" value="cancel" onclick="placeInNewTodo(buttonTemplate)">
</form>
`;

const buttonTemplate = `<button onclick="generateTodoForm()">Add Todo</button>`

const createToDoTitle = function (todo) {
  const title = createTag('h3', todo.title);
  return title;
}

const createToDoDescription = function (todo) {
  const description = createTag('p', todo.description);
  return description;
}

const createDeleteButton = function (todo) {
  const button = createButton('delete')
  button.id = todo.id;
  button.onclick = deleteTodo;
  return button;
}

const createOpenButton = function () {
  return createButton('open');
}

const createOpenReference = function (todo) {
  const openButton = createOpenButton();
  const reference = createElement('a');
  reference.href = '/' + userId + '/' + todo.id;
  reference.appendChild(openButton);
  return reference;
}

const createTodoDiv = function (todo) {
  const todoDiv = createElement('div');
  todoDiv.id = todo.id;
  todoDiv.appendChild(createToDoTitle(todo));
  todoDiv.appendChild(createToDoDescription(todo));
  todoDiv.appendChild(createOpenReference(todo));
  todoDiv.appendChild(createDeleteButton(todo));
  return todoDiv;
}

const deleteTodo = function () {
  const todoId = event.target.id;
  fetch(`/${userId}/deleteTodo`, {
    method: 'POST',
    body: JSON.stringify({ todoId })
  }).then(res => {
    getTodos();
  })
}

const placeInNewTodo = function (html) {
  document.getElementById('newTodo').innerHTML = html;
}

const generateTodoForm = function () {
  placeInNewTodo(formTemplate);
}

const addTodo = function () {
  const form = document.getElementById('form')
  const body = {
    title: form.title.value,
    description: form.description.value
  }
  fetch(`/${userId}/addTodo`, {
    method: 'POST',
    body: JSON.stringify(body)
  }).then(res => getTodos());
  placeInNewTodo(buttonTemplate);
}

const getTodos = function () {
  fetch(`/${userId}/todos`, {
    method: 'POST'
  })
    .then(res => res.json())
    .then(data => {
      const todos = document.getElementById('todos');
      todos.innerText = "";
      data.reverse();
      data.forEach(todo => {
        const todoDiv = createTodoDiv(todo);
        todos.appendChild(todoDiv);
        const hr = createElement('hr');
        todos.appendChild(hr);
      })
    });
}

const initialize = function () {
  createHeader();
  getTodos();
  placeInNewTodo(buttonTemplate);
}

window.onload = initialize;