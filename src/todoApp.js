const { Express } = require('./express.js');
const fs = require('fs');
const app = new Express();
const {
  Item,
  Items,
  Todo
} = require('./entities.js');

const todoPageHtml = fs.readFileSync('./public/todo.html', 'utf8');

const TODOLIST_HTMLPAGE = fs.readFileSync('./public/todos.html', 'utf8');

const renderHomePage = function (req, res) {
  const userId = req.user.details.id;
  res.write(TODOLIST_HTMLPAGE.replace('##userId##', userId));
  res.end();
}

const sendTodos = function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(req.user.getTodosDetails()));
  res.end()
}

const deleteTodoFile = function (todoId) {
  let path = `./sai/todos/${todoId}.json`;
  fs.unlink(path, (err) => {
    if (err) {
      console.log(err);
    }
  })
}

const deleteTodo = function (req, res) {
  let { todoId } = JSON.parse(req.body);
  req.user.deleteTodo(todoId);
  deleteTodoFile(todoId);
  res.end();
}

const createTodoFile = function (todo) {
  const todoData = JSON.stringify(todo.getTodo());
  const todoId = todo.getDetails().id;
  const path = `./sai/todos/${todoId}.json`;
  fs.writeFile(path, todoData, (err) => {
    if (err) console.log(err);
  })
}

const addTodo = function (req, res) {
  const todoDetails = JSON.parse(req.body);
  const items = new Items();
  todoDetails.id = Date.now();
  const todo = new Todo(todoDetails, items);
  req.user.addTodo(todo);
  createTodoFile(todo);
  res.end();
}

const todoPage = function (userId, todoId) {
  const page = todoPageHtml.replace('##todoId##', todoId);
  return page.replace('##userId##', userId);
}

const renderTodoDetail = function (req, res, next) {
  const todoId = req.url.slice(1);
  if (+todoId && req.user.isTodoPresent(todoId)) {
    res.setHeader('Content-Type', 'text/html');
    const userId = req.user.details.id;
    res.write(todoPage(userId, todoId));
    res.end();
    return;
  }
  next();
}

const sendTodoList = function (req, res) {
  const { todoId } = JSON.parse(req.body);
  const todoData = JSON.stringify(req.user.getTodoJson(todoId));
  res.setHeader('Content-Type', 'application/json')
  res.write(todoData)
  res.end();
}

const getTodoId = (url) => url.split('/')[1];

const updateTodo = function (user, todoId) {
  fs.writeFile(`./users/${user.details.id}/todos/${todoId}.json`, JSON.stringify(user.getTodoJson(todoId)), (err) => {
    if (err) console.log(err);
  })
}

const addItem = function (req, res) {
  const todoId = getTodoId(req.url);
  if (!req.user.isTodoPresent(todoId)) {
    sendNotFound(req, res);
    return;
  }
  const { itemContent } = JSON.parse(req.body);
  const itemId = Date.now();
  const status = true;
  const item = new Item(itemId, status, itemContent);
  req.user.addItemToTodo(todoId, item);
  updateTodo(req.user, todoId);
  res.end();
}

const getItems = function (req, res) {
  const todoId = getTodoId(req.url);
  console.log('it came')
  if (!req.user.isTodoPresent(todoId)) {
    sendNotFound(req, res);
    return;
  }
  const items = JSON.stringify(req.user.getItems(todoId));
  res.setHeader('Content-Type', 'application/json');
  res.write(items);
  res.end();
}

const getDetails = function (req, res) {
  const todoId = getTodoId(req.url);
  if (!req.user.isTodoPresent(todoId)) {
    sendNotFound(req, res);
    return;
  }
  const items = JSON.stringify(req.user.getTodoDetails(todoId));
  res.setHeader('Content-Type', 'application/json');
  res.write(items);
  res.end();
}

const toggleItemStatus = function (req, res) {
  const todoId = getTodoId(req.url);
  const { itemId } = JSON.parse(req.body);
  req.user.toggleTodoItemStatus(todoId, itemId);
  updateTodo(req.user, todoId)
  res.end();
  return;
}

const deleteItem = function (req, res) {
  const todoId = getTodoId(req.url);
  const { itemId } = JSON.parse(req.body);
  req.user.deleteItemInTodo(todoId, itemId);
  updateTodo(req.user, todoId)
  res.end();
  return;
}

const modifyTodoDetails = function (req, res) {
  const todoId = getTodoId(req.url);
  const details = JSON.parse(req.body);
  req.user.modifyTodoDetails(todoId, details);
  updateTodo(req.user, todoId)
  res.end();
  return;
}

const modifyItemContent = function (req, res) {
  const todoId = getTodoId(req.url);
  const { itemId, itemContent } = JSON.parse(req.body);
  req.user.modifyTodoItemContent(todoId, itemId, itemContent);
  updateTodo(req.user, todoId)
  res.end();
  return;
}

app.use(renderTodoDetail);
app.get('/', renderHomePage);
app.post('/todos', sendTodos);
app.post('/addTodo', addTodo);
app.post('/deleteTodo', deleteTodo);
app.post('/getTodo', sendTodoList);
app.post(/\/.*\/getItems/, getItems);
app.post(/\/.*\/getDetails /, getDetails);
app.post(/\/.*\/addItem/, addItem);
app.post(/\/.*\/deleteItem/, deleteItem);
app.post(/\/.*\/toggleItemStatus/, toggleItemStatus);
app.post(/\/.*\/modifyTodoDetails/, modifyTodoDetails);
app.post(/\/.*\/modifyItemContent/, modifyItemContent);

module.exports = app.requestHandler.bind(app);