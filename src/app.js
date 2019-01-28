const fs = require('fs');

const {UTILS, SEND_HANDLER, RENDER_PAGES, READ_OPTIONS,EXPRESS,
  USERS, COOKIES, COOKIES_FILE, ENCODING, USERS_DATA
} = require("./constants.js");
const { logRequest } = require(UTILS);
const { sendNotFound } = require(SEND_HANDLER);
const { renderHomePage, renderFiles, loginHandler, renderLoginPage } = require(RENDER_PAGES);
const { readBody, readCookies } = require(READ_OPTIONS);
const { Express } = require(EXPRESS);

const { AllUsersDetail, UserDetail } = require(USERS);
const { Cookie, Cookies } = require(COOKIES);

const cookies = new Cookies();
const app = new Express();
const allUsers = new AllUsersDetail();
const readUsers = function () {
  if (!fs.existsSync(USERS_DATA)) {
    fs.mkdirSync(USERS_DATA);
  }
  const users = fs.readdirSync(USERS_DATA)
  users.forEach(user => {
    let detail = fs.readFileSync(`./users/${user}/details.json`, ENCODING)
    let userDetail = new UserDetail(JSON.parse(detail));
    allUsers.addUser(userDetail);
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
  let cookie = new Cookie({id:cookieId, userId:id});
  cookies.addCookie(cookie);
  updateCookies();
  res.setHeader('Set-Cookie', `id=${cookieId}`);
  res.writeHead(302, {
    Location: `/${id}`
  })
  res.end();
}

const userHandler = function(req,res,next){
  let cookie = req.cookies;
  const userId = req.url.slice(1);
  if(cookie.id && cookies.isPresent(cookie.id,userId)){
    fs.readFile("./public/userToDo.html", "utf8", (err, content) => {
      if(err){
        sendNotFound(req, res);
        return;
      }
      console.log(content);
      res.write(content);
      res.end();
    });
    return; 
  }
  next();
}

const logoutHandler = function(req,res){
  cookies.deleteCookie(req.cookies.id);
  updateCookies();
  res.setHeader('Set-Cookie',`id=null`);
  res.writeHead(302,{
    Location:'/'
  });
  res.end();
}

app.use(logRequest);
app.use(readBody);
app.use(readCookies);
app.use(userHandler);
app.post('/getCookie', renderLoggedin)
app.post('/login', loginHandler.bind(null, fs, cookies, allUsers));
app.get('/login', renderLoginPage.bind(null, fs));
app.get('/', renderHomePage.bind(null, fs, cookies));
app.post('/upload', createUserHandler);
app.get('/logout',logoutHandler);
app.use(renderFiles.bind(null, fs));
app.use(sendNotFound);

module.exports = app.requestHandler.bind(app);