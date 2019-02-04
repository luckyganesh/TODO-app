const fs = require('fs');

const { UTILS, SEND_HANDLER, RENDER_PAGES, READ_OPTIONS, EXPRESS,
  ENTITIES, COOKIES, COOKIES_FILE, ENCODING, USERS_DATA
} = require("./constants.js");

const { logRequest, redirect } = require(UTILS);
const { renderHomePage, renderFiles, renderLoginPage } = require(RENDER_PAGES);
const { readBody, readCookies, readArgs } = require(READ_OPTIONS);
const { send } = require(SEND_HANDLER);

//const { Express } = require('express');//require(EXPRESS);
const todoApp = require('./todoApp.js');

const { Task,
  Tasks,
  Todo,
  Todos,
  User,
  UserDetail,
  Users
} = require(ENTITIES);

const { Cookie, Cookies } = require(COOKIES);
const express = require('express');
const app = express();

const writeFile = function (fs, fileName, data) {
  fs.writeFile(fileName, data, () => { });
}

const setCookie = function (res, cookieData) {
  res.setHeader('Set-Cookie', cookieData);
}

const readTaskData = function (taskData) {
  const { id, status, content } = taskData;
  return new Task(id, status, content);
}

const readTasksData = function (tasksData) {
  const tasks = new Tasks();
  tasksData.forEach(taskData => {
    const task = readTaskData(taskData);
    tasks.addTask(task);
  })
  return tasks;
}

const readTodoData = function (todoData) {
  const details = todoData.details;
  const tasks = readTasksData(todoData.tasks);
  return new Todo(details, tasks);
}

const readTodosData = function (todosData) {
  const todos = new Todos();
  todosData.forEach(todoData => {
    const todo = readTodoData(todoData);
    todos.addTodo(todo);
  });
  return todos;
}

const readUserData = function (userData) {
  const details = new UserDetail(userData.details);
  const todos = readTodosData(userData.todos);
  return new User(details, todos);
}

const readUsersData = function (usersData) {
  const users = new Users();
  usersData.forEach(userData => {
    const user = readUserData(userData);
    users.addUser(user);
  });
  return users;
}

const readUsersFile = function (fs) {
  if (!fs.existsSync(USERS_DATA)) {
    fs.writeFileSync('./users.json', '[]');
  }
  const usersData = fs.readFileSync(USERS_DATA, 'utf8');
  return readUsersData(JSON.parse(usersData));
}

const createCookiesCache = function (cookiesData) {
  const cookies = new Cookies();
  cookiesData.forEach(cookieData => {
    const cookie = new Cookie(cookieData);
    cookies.addCookie(cookie);
  });
  return cookies;
}

const readCookiesFile = function (fs) {
  if (!fs.existsSync(COOKIES_FILE)) {
    fs.writeFileSync(COOKIES_FILE, '[]', ENCODING);
  }
  const cookiesDataInString = fs.readFileSync(COOKIES_FILE, ENCODING)
  const cookiesData = JSON.parse(cookiesDataInString);
  return createCookiesCache(cookiesData);
}

const cookies = readCookiesFile(fs);

const users = readUsersFile(fs)

const updateUsersDataFile = function (fs, users) {
  const usersData = JSON.stringify(users.getUsersData());
  writeFile(fs, USERS_DATA, usersData);
}

const createNewUser = function (userData) {
  const userDetails = new UserDetail(userData);
  const todos = new Todos();
  return new User(userDetails, todos)
}

const createUserHandler = function (fs, users, req, res) {
  let userData = JSON.parse(req.body);
  const { id } = userData;
  const isValid = users.isAlreadyPresent(id);
  send(res, 200, JSON.stringify({ status: +isValid }), 'application/json');
  if (isValid) return;
  const user = createNewUser(userData);
  users.addUser(user);
  updateUsersDataFile(fs, users);
}

const updateCookies = function (fs, cookies) {
  fs.writeFile(COOKIES_FILE, JSON.stringify(cookies.getCookies()), () => { });
}

const provideCookie = function (fs, cookies, req, res) {
  let { id } = readArgs(req.body);
  let cookieId = new Date().getTime();
  let cookie = new Cookie({ id: cookieId, userId: id });
  cookies.addCookie(cookie);
  updateCookies(fs, cookies);
  setCookie(res, `id=${cookieId}`);
  redirect(res, `/${id}`);
}

const loginHandler = function (allusers, req, res) {
  const { id, password } = JSON.parse(req.body);
  const status = +allusers.validateUser(id, password);
  send(res, 200, JSON.stringify({ status }), 'application/json');
}

const userHandler = function (fs, cookies, users, req, res, next) {
  let cookie = req.cookies;
  const userId = req.url.split('/')[1];
  if (cookie.id && cookies.isPresent(cookie.id, userId)) {
    req.url = '/' + req.url.split('/').slice(2).join('/');
    req.user = users.getUser(userId);
    todoApp(req, res);
    if (req.isChange) updateUsersDataFile(fs, users);
    return;
  }
  next();
}

const logoutHandler = function (fs, cookies, req, res) {
  cookies.deleteCookie(req.cookies.id);
  updateCookies(fs, cookies);
  setCookie(res, `id=null`);
  redirect(res, '/login');
}

app.use(logRequest);
app.use(readBody);
app.use(readCookies);
app.use(userHandler.bind(null, fs, cookies, users));
app.post('/cookie', provideCookie.bind(null, fs, cookies));
app.post('/login', loginHandler.bind(null, users));
app.get('/login', renderLoginPage.bind(null, fs, cookies));
app.get('/', renderHomePage.bind(null, cookies));
app.post('/createNewUser', createUserHandler.bind(null, fs, users));
app.get('/logout', logoutHandler.bind(null, fs, cookies));
app.use(express.static('public'));

module.exports = app;//.requestHandler.bind(app);