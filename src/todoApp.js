const { Express } = require('./express.js');
const fs = require('fs');
const app = new Express();
const {
  Item,
  Items,
  Todo
} = require('./entities.js');

const { send, sendNotFound } = require('./send_handler.js')
const todoPageHtml = fs.readFileSync('./public/todo.html', 'utf8');

const TODOLIST_HTMLPAGE = fs.readFileSync('./public/todos.html', 'utf8');

const renderHomePage = function (req, res) {
  const userId = req.user.details.id;
  res.write(TODOLIST_HTMLPAGE.replace('##userId##', userId));
  res.end();
}

const sendTodos = function (req, res) {
  const content = JSON.stringify(req.user.getTodosDetails());
  send(res, 200, content, 'application/json');
  return;
}

const updateTodoFile = function (user, todoId) {
  fs.writeFile(`./users/${user.details.id}/todos/${todoId}.json`, JSON.stringify(user.getTodoJson(todoId)), (err) => {
    if (err) console.log(err);
  })
}

const updateTodoAndEndRes = function (res, user, todoId) {
  updateTodoFile(user, todoId);
  res.end();
  return;
}

const deleteTodoFile = function (userId, todoId) {
  let path = `./users/${userId}/todos/${todoId}.json`;
  fs.unlink(path, (err) => {
    if (err) {
      console.log(err);
    }
  })
}

const deleteTodo = function (req, res) {
  let { todoId } = JSON.parse(req.body);
  req.user.deleteTodo(todoId);
  const userId = req.user.details.id;
  deleteTodoFile(userId, todoId);
  res.end();
}

const createNewTodo = function (todoDetails) {
  const items = new Items();
  todoDetails.id = Date.now();
  return new Todo(todoDetails, items);
}
const addTodo = function (req, res) {
  const todoDetails = JSON.parse(req.body);
  const todo = createNewTodo(todoDetails);
  req.user.addTodo(todo);
  updateTodoAndEndRes(res, req.user, todoDetails.id);
  return;
}

const todoPage = function (userId, todoId) {
  const page = todoPageHtml.replace('##todoId##', todoId);
  return page.replace('##userId##', userId);
}

const isValidTodo = function (user, todoId) {
  return +todoId && user.isTodoPresent(todoId)
}

const renderTodoDetail = function (req, res, next) {
  const todoId = req.url.slice(1);
  if (!isValidTodo(req.user, todoId)) {
    next();
    return;
  }
  const userId = req.user.details.id;
  const content = todoPage(userId, todoId);
  send(res, 200, content, 'text/html');
  return;
}

const sendTodoList = function (req, res) {
  const { todoId } = JSON.parse(req.body);
  const todoData = JSON.stringify(req.user.getTodoJson(todoId));
  send(res, 200, todoData, 'application/json');
  return;
}

const getTodoId = (url) => url.split('/')[1];

const createNewItem = function (itemContent) {
  const itemId = Date.now();
  const status = true;
  return new Item(itemId, status, itemContent);
}

const addItem = function (req, res) {
  const todoId = getTodoId(req.url);
  const { itemContent } = JSON.parse(req.body);
  const item = createNewItem(itemContent);
  req.user.addItemToTodo(todoId, item);
  updateTodoAndEndRes(res, req.user, todoId);
  return;
}

const getItems = function (req, res) {
  const todoId = getTodoId(req.url);
  const items = JSON.stringify(req.user.getItems(todoId));
  send(res, 200, items, 'application/json');
  return;
}

const getDetails = function (req, res) {
  const todoId = getTodoId(req.url);
  const items = JSON.stringify(req.user.getTodoDetails(todoId));
  send(res, 200, items, 'application/json');
  return;
}

const toggleItemStatus = function (req, res) {
  const todoId = getTodoId(req.url);
  const { itemId } = JSON.parse(req.body);
  req.user.toggleTodoItemStatus(todoId, itemId);
  updateTodoAndEndRes(res, req.user, todoId);
  return;
}

const deleteItem = function (req, res) {
  const todoId = getTodoId(req.url);
  const { itemId } = JSON.parse(req.body);
  req.user.deleteItemInTodo(todoId, itemId);
  updateTodoAndEndRes(res, req.user, todoId);
  return;
}

const modifyTodoDetails = function (req, res) {
  const todoId = getTodoId(req.url);
  const details = JSON.parse(req.body);
  req.user.modifyTodoDetails(todoId, details);
  updateTodoAndEndRes(res, req.user, todoId);
  return;
}

const modifyItemContent = function (req, res) {
  const todoId = getTodoId(req.url);
  const { itemId, itemContent } = JSON.parse(req.body);
  req.user.modifyTodoItemContent(todoId, itemId, itemContent);
  updateTodoAndEndRes(res, req.user, todoId);
  return;
}

const checkValidTodo = function (req, res, next) {
  const todoId = getTodoId(req.url);
  const isValid = isValidTodo(req.user, todoId);
  const nextFunction = isValid ? next : sendNotFound;
  nextFunction(req, res);
  return;
}

app.use(renderTodoDetail);
app.get('/', renderHomePage);
app.post('/todos', sendTodos);
app.post('/addTodo', addTodo);
app.post('/deleteTodo', deleteTodo);
app.post('/getTodo', sendTodoList);
app.use(checkValidTodo);
app.post(/\/.*\/getItems/, getItems);
app.post(/\/.*\/getDetails /, getDetails);
app.post(/\/.*\/addItem/, addItem);
app.post(/\/.*\/deleteItem/, deleteItem);
app.post(/\/.*\/toggleItemStatus/, toggleItemStatus);
app.post(/\/.*\/modifyTodoDetails/, modifyTodoDetails);
app.post(/\/.*\/modifyItemContent/, modifyItemContent);

module.exports = app.requestHandler.bind(app);