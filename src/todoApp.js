const fs = require('fs');
const { Express } = require('./express.js');
const app = new Express();
const {
  Task,
  Tasks,
  Todo
} = require('./entities.js');

const { send, sendNotFound } = require('./send_handler.js')

const TASKS_HTML = fs.readFileSync('./public/todo.html', 'utf8');

const TODOS_HTML = fs.readFileSync('./public/todos.html', 'utf8');

const getTodoId = (url) => url.split('/')[1];

const renderTodosPage = function (req, res) {
  const userId = req.user.getId();
  res.write(TODOS_HTML.replace('##userId##', userId));
  res.end();
}

const sendTodos = function (req, res) {
  const content = JSON.stringify(req.user.getTodosDetails());
  send(res, 200, content, 'application/json');
  return;
}

const updateTodoFile = function (user, todoId) {
  fs.writeFile(`./users/${user.getId()}/todos/${todoId}.json`, JSON.stringify(user.getTodoJson(todoId)), (err) => {
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
  const userId = req.user.getId();
  deleteTodoFile(userId, todoId);
  res.end();
}

const createNewTodo = function (todoDetails) {
  const tasks = new Tasks();
  todoDetails.id = Date.now();
  return new Todo(todoDetails, tasks);
}

const addTodo = function (req, res) {
  const todoDetails = JSON.parse(req.body);
  const todo = createNewTodo(todoDetails);
  req.user.addTodo(todo);
  updateTodoAndEndRes(res, req.user, todoDetails.id);
  return;
}

const todoPage = function (userId, todoId) {
  const page = TASKS_HTML.replace('##todoId##', todoId);
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
  const userId = req.user.getId();
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

const createNewTask = function (taskContent) {
  const taskId = Date.now();
  const status = true;
  return new Task(taskId, status, taskContent);
}

const addTask = function (req, res) {
  const todoId = getTodoId(req.url);
  const { taskContent } = JSON.parse(req.body);
  const task = createNewTask(taskContent);
  req.user.addTaskToTodo(todoId, task);
  updateTodoAndEndRes(res, req.user, todoId);
  return;
}

const getTasks = function (req, res) {
  const todoId = getTodoId(req.url);
  const tasks = JSON.stringify(req.user.getTasks(todoId));
  send(res, 200, tasks, 'application/json');
  return;
}

const getDetails = function (req, res) {
  const todoId = getTodoId(req.url);
  const tasks = JSON.stringify(req.user.getTodoDetails(todoId));
  send(res, 200, tasks, 'application/json');
  return;
}

const toggleTaskStatus = function (req, res) {
  const todoId = getTodoId(req.url);
  const { taskId } = JSON.parse(req.body);
  req.user.toggleTodoTaskStatus(todoId, taskId);
  updateTodoAndEndRes(res, req.user, todoId);
  return;
}

const deleteTask = function (req, res) {
  const todoId = getTodoId(req.url);
  const { taskId } = JSON.parse(req.body);
  req.user.deleteTaskInTodo(todoId, taskId);
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

const modifyTaskContent = function (req, res) {
  const todoId = getTodoId(req.url);
  const { taskId, taskContent } = JSON.parse(req.body);
  req.user.modifyTodoTaskContent(todoId, taskId, taskContent);
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
app.get('/', renderTodosPage);
app.post('/todos', sendTodos);
app.post('/addTodo', addTodo);
app.post('/deleteTodo', deleteTodo);
app.post('/getTodo', sendTodoList);
app.use(checkValidTodo);
app.post(/\/.*\/getTasks/, getTasks);
app.post(/\/.*\/getDetails/, getDetails);
app.post(/\/.*\/addTask/, addTask);
app.post(/\/.*\/deleteTask/, deleteTask);
app.post(/\/.*\/toggleTaskStatus/, toggleTaskStatus);
app.post(/\/.*\/modifyTodoDetails/, modifyTodoDetails);
app.post(/\/.*\/modifyTaskContent/, modifyTaskContent);
app.use(sendNotFound);

module.exports = app.requestHandler.bind(app);