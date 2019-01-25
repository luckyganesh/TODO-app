const fs = require('fs');


const { logRequest } = require("./utils.js");
const { sendNotFound } = require('./send_handler.js');
const { renderHomePage, renderFiles, loginHandler, renderLoginPage } = require('./renderPages.js');
const { readBody, readCookies } = require('./readOptions.js');
const { Express } = require('./express.js');
const { AllUsersDetail, UserDetail } = require('./users.js')
const { Cookie, Cookies } = require('./cookies.js');

const cookies = new Cookies();
const app = new Express();
const allUsers = new AllUsersDetail();

const readUsers = function () {
  if (!fs.existsSync('./users')) {
    fs.mkdirSync('./users');
  }
  const users = fs.readdirSync('./users')
  users.forEach(user => {
    let detail = fs.readFileSync(`./users/${user}/details.json`, 'utf8')
    let userDetail = new UserDetail(JSON.parse(detail));
    allUsers.addUser(userDetail);
  });
}

const readCookiesFile = function () {
  if (!fs.existsSync('./src/cookies.json')) {
    fs.writeFileSync('./src/cookies.json', '[]', 'utf8');
    return;
  }
  const cookiesDataInString = fs.readFileSync('./src/cookies.json', 'utf8')
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
  console.log(userDetail);
  const { id } = userDetail;
  if (allUsers.isAlreadyPresent(id)) {
    res.write(JSON.stringify({ status: 0 }))
    res.end();
    console.log(allUsers);
    return;
  }
  res.write(JSON.stringify({ status: 1 }))
  res.end();
  let user = new UserDetail(userDetail);
  allUsers.addUser(user);
  fs.mkdir(`./users/${id}`, (err) => {
    if (!err) {
      fs.writeFile(`./users/${id}/details.json`, JSON.stringify(userDetail), (err) => {
        if (err) {
          console.log(err);
        }
      })
    }
  })
}

const splitKeyValue = pair => pair.split('=');

console.log(cookies);
const placeInObject = function (object, keyValuePair) {
  let [key, value] = splitKeyValue(keyValuePair);
  object[key] = value;
  return object;
}

const readArgs = content => {
  return content.split('&').reduce(placeInObject, {});
};

const updateCookies = function () {
  fs.writeFile('./src/cookies.json', JSON.stringify(cookies.getCookies()), (err) => {
    if (err) {
      console.log(err);
    }
  })
}

const renderLoggedin = function (req, res) {
  let { id } = readArgs(req.body);
  let cookieId = new Date().getTime();
  let cookie = new Cookie({cookieId, id});
  console.log(cookie);
  cookies.addCookie(cookie);
  updateCookies();
  res.setHeader('Set-Cookie', `id=${cookieId}`);
  res.writeHead(302, {
    Location: `/${id}`
  })
  res.end();
}

console.log(allUsers);

app.use(logRequest);
app.use(readBody);
app.use(readCookies);
// app.use(userHandler);
app.post('/getCookie', renderLoggedin)
app.post('/login', loginHandler.bind(null, fs, cookies, allUsers));
app.get('/login', renderLoginPage.bind(null, fs))
app.get('/', renderHomePage.bind(null, fs, cookies));
app.post('/upload', createUserHandler);
app.use(renderFiles.bind(null, fs));
app.use(sendNotFound);

module.exports = app.requestHandler.bind(app);