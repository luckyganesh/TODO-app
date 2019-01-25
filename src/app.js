const fs = require('fs');


const { logRequest } = require("./utils.js");
const { sendNotFound } = require('./send_handler.js');
const { renderHomePage, renderFiles, loginHandler, renderLoginPage } = require('./renderPages.js');
const { readBody, readCookies } = require('./readOptions.js');
const { Express } = require('./express.js');
const { AllUsersDetail, UserDetail } = require('./users.js')
const cookies = JSON.parse(fs.readFileSync('./src/cookies.json', 'utf8'));

const app = new Express();
const allUsers = new AllUsersDetail();

const readUsers = function () {
  if(!fs.existsSync('./users')){
    fs.mkdirSync('./users');
  }
  const users = fs.readdirSync('./users')
  users.forEach(user => {
    let detail = fs.readFileSync(`./users/${user}/details.json`, 'utf8')
    let userDetail = new UserDetail(JSON.parse(detail));
    allUsers.addUser(userDetail);
  });
}

readUsers();

const createUserHandler = function (req, res) {
  let userDetail = JSON.parse(req.body);
  const { id, name, password } = userDetail;
  if (allUsers.isAlreadyPresent(id)) {
    res.write(JSON.stringify({ status: 0 }))
    res.end();
    console.log(allUsers);
    return;
  }
  res.write(JSON.stringify({ status: 1 }))
  res.end();
  let user = new UserDetail(userDetail);
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

app.use(logRequest);
app.use(readBody);
app.use(readCookies);
app.post('/login', loginHandler.bind(null, fs, cookies));
app.get('/login', renderLoginPage.bind(null,fs))
app.get('/', renderHomePage.bind(null, fs, cookies));
app.post('/upload', createUserHandler);
app.use(renderFiles.bind(null, fs));
app.use(sendNotFound);

module.exports = app.requestHandler.bind(app);