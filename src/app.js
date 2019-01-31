const fs = require('fs');

const { UTILS, SEND_HANDLER, RENDER_PAGES, READ_OPTIONS, EXPRESS,
  ENTITIES, COOKIES, COOKIES_FILE, ENCODING, USERS_DATA
} = require("./constants.js");
const { logRequest } = require(UTILS);
const { sendNotFound } = require(SEND_HANDLER);
const { renderHomePage, renderFiles, loginHandler, renderLoginPage } = require(RENDER_PAGES);
const { readBody, readCookies } = require(READ_OPTIONS);
const { Express } = require(EXPRESS);
const todoApp = require('./todoApp.js');

const { Item,
  Items,
  Todo,
  Todos,
  User,
  AllUsersDetail,
  UserDetail,
  Users } = require(ENTITIES);

const { Cookie, Cookies } = require(COOKIES);

const cookies = new Cookies();
const app = new Express();
const allUsersDetails = new AllUsersDetail();
const users = new Users();

const readTodos = function (userId) {
  const todosDir = fs.readdirSync(`./users/${userId}/todos`);
  const todos = new Todos();
  todosDir.forEach(todoDir => {
    const todoData = JSON.parse(fs.readFileSync(`./users/${userId}/todos/${todoDir}`, 'utf8'));
    const todoDetails = todoData.details;
    const items = new Items();
    todoData.items.forEach(({ id, status, content }) => {
      let item = new Item(id, status, content);
      items.addItem(item);
    })
    const todo = new Todo(todoDetails, items);
    todos.addTodo(todo);
  })
  return todos;
}

const readUsers = function () {
  if (!fs.existsSync(USERS_DATA)) {
    fs.mkdirSync(USERS_DATA);
  }
  const usersIds = fs.readdirSync(USERS_DATA)
  usersIds.forEach(userId => {
    const details = JSON.parse(fs.readFileSync(`./users/${userId}/userDetails.json`, ENCODING));
    const todos = readTodos(userId);
    const userDetail = new UserDetail(details);
    allUsersDetails.addUser(userDetail);
    const user = new User(details, todos);
    users.addUser(user);
  });
}

const readCookiesFile = function () {
  if (!fs.existsSync(COOKIES_FILE)) {
    fs.writeFileSync(COOKIES_FILE, '[]', ENCODING);
    return;
  }
  const cookiesDataInString = fs.readFileSync(COOKIES_FILE, ENCODING)
  const cookiesData = JSON.parse(cookiesDataInString);
  cookiesData.forEach(cookieData => {
    let cookie = new Cookie(cookieData);
    cookies.addCookie(cookie);
  })
}
readCookiesFile();

readUsers();

const createUserHandler = function (req, res) {
  let userDetail = JSON.parse(req.body);
  const { id } = userDetail;
  if (allUsersDetails.isAlreadyPresent(id)) {
    res.write(JSON.stringify({ status: 0 }))
    res.end();
    console.log(allUsersDetails);
    return;
  }
  res.write(JSON.stringify({ status: 1 }))
  res.end();
  let user = new UserDetail(userDetail);
  const todos = new Todos()
  users.addUser(userDetail, todos);
  allUsersDetails.addUser(user);
  fs.mkdir(`./users/${id}`, () => {
    fs.writeFile(`./users/${id}/details.json`, JSON.stringify(userDetail), () => { });
    fs.mkdir(`/users/${id}/todos`, () => { });
  })
}

const splitKeyValue = pair => pair.split('=');

const placeInObject = function (object, keyValuePair) {
  let [key, value] = splitKeyValue(keyValuePair);
  object[key] = value;
  return object;
}

const readArgs = content => {
  return content.split('&').reduce(placeInObject, {});
};

const updateCookies = function () {
  fs.writeFile(COOKIES_FILE, JSON.stringify(cookies.getCookies()), (err) => {
    if (err) {
      console.log(err);
    }
  })
}

const renderLoggedin = function (req, res) {
  let { id } = readArgs(req.body);
  let cookieId = new Date().getTime();
  let cookie = new Cookie({ id: cookieId, userId: id });
  cookies.addCookie(cookie);
  updateCookies();
  res.setHeader('Set-Cookie', `id=${cookieId}`);
  res.writeHead(302, {
    Location: `/${id}`
  })
  res.end();
}

const userHandler = function (req, res, next) {
  let cookie = req.cookies;
  const userId = req.url.split('/')[1];
  if (cookie.id && cookies.isPresent(cookie.id, userId)) {
    req.url = '/' + req.url.split('/').slice(2).join('/');
    console.log(req.url);
    req.user = users.getUser(userId);
    todoApp(req, res);
    return;
  }
  next();
}

const logoutHandler = function (req, res) {
  cookies.deleteCookie(req.cookies.id);
  updateCookies();
  res.setHeader('Set-Cookie', `id=null`);
  res.writeHead(302, {
    Location: '/'
  });
  res.end();
}

app.use(logRequest);
app.use(readBody);
app.use(readCookies);
app.use(userHandler);
app.post('/getCookie', renderLoggedin)
app.post('/login', loginHandler.bind(null, fs, cookies, allUsersDetails));
app.get('/login', renderLoginPage.bind(null, fs));
app.get('/', renderHomePage.bind(null, fs, cookies));
app.post('/upload', createUserHandler);
app.get('/logout', logoutHandler);
app.use(renderFiles.bind(null, fs));
app.use(sendNotFound);

module.exports = app.requestHandler.bind(app);