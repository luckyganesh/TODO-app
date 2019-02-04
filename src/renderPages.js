const { MIME_TEXT_PLAIN, MIME_TYPES } = require('./constants.js');
const { send, sendNotFound } = require('./send_handler.js');

const addPrefix = (url) => `./public${url}`;

const getExtension = function (fileName) {
  return fileName.split('.').pop();
}

const getType = function (fileName) {
  const type = getExtension(fileName);
  return MIME_TYPES[type] || MIME_TEXT_PLAIN;
}

const redirectLoggedIn = function (res) {
  res.writeHead(302, {
    Location: '/login'
  })
  res.end();
}

const renderFiles = function (fs, req, res) {
  const filePath = addPrefix(req.url);
  const contentType = getType(req.url);
  fs.readFile(filePath, (err, content) => {
    if (err) {
      redirectLoggedIn(res);
      return;
    }
    send(res, 200, content, contentType);
  })
}

const renderLoginPage = function (fs, cookies, req, res) {
  const id = +req.cookies.id;
  if (id && cookies.isIdPresent(id)) {
    let userId = cookies.giveMeUser(id).userId;
    res.writeHead(302, {
      Location: '/' + userId
    });
    res.end();
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
  if (id && cookies.isIdPresent(id)) {
    let userId = cookies.giveMeUser(id).userId;
    res.writeHead(302, {
      Location: '/' + userId
    })
    res.end();
    return;
  }
  res.writeHead(302, {
    Location: '/login'
  });
  res.end();
}

module.exports = {
  renderHomePage,
  renderLoginPage,
  renderFiles
}