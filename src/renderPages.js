const { MIME_TEXT_PLAIN, MIME_TYPES } = require('./constants.js');
const { send, sendNotFound } = require('./send_handler.js');
const { redirect, getType, addPrefix } = require('./utils.js');

const renderFiles = function (fs, req, res) {
  const filePath = addPrefix(req.url);
  const contentType = getType(req.url);
  fs.readFile(filePath, (err, content) => {
    if (err) {
      redirect(res, '/login');
      return;
    }
    send(res, 200, content, contentType);
  })
}

const renderLoginPage = function (fs, cookies, req, res) {
  const id = +req.cookies.id;
  if (id && cookies.isIdPresent(id)) {
    let userId = cookies.giveMeUser(id).userId;
    redirect(res, `/${userId}`);
    return;
  }
  fs.readFile('./public/login.html', (err, content) => {
    if (err) {
      sendNotFound(req, res);
      return;
    }
    send(res, 200, content, 'text/html');
  })
}

const renderHomePage = function (cookies, req, res) {
  const id = +req.cookies.id;
  let location = '/login';
  if (id && cookies.isIdPresent(id)) {
    let userId = cookies.giveMeUser(id).userId;
    location = `/${userId}`;
  }
  redirect(res, location);
  return;
}

module.exports = {
  renderHomePage,
  renderLoginPage,
  renderFiles
}