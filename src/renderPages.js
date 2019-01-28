const { send, sendNotFound } = require('./send_handler.js');

const renderFiles = function (fs, req, res) {
  let filePath = `./public${req.url}`;
  fs.readFile(filePath, (err, content) => {
    if (err) {
      sendNotFound(req, res);
      return;
    }
    send(res, 200, content, "text/html");
  })
}

const loginHandler = function (fs, cookies, allusers, req, res) {
  const { id, password } = JSON.parse(req.body);
  if (allusers.validateUser(id,password)) {
    res.write(JSON.stringify({ status: 1 }))
    res.end();
    return ;
  }
  res.write(JSON.stringify({ status: 0 }))
  res.end();
};

const renderLoginPage = function (fs, req, res) {
  fs.readFile('./public/login.html', (err, content) => {
    if (err) {
      sendNotFound(req, res);
      return;
    }
    send(res, 200, content, 'text/html');
  })
}

const renderHomePage = function (fs, cookies, req, res) {
  const id = +req.cookies.id;
  if (id) {
    if (cookies.isIdPresent(id)) {
      let userId = cookies.giveMeUser(id).userId;
      res.writeHead(302,{
        Location:'/'+userId
      })
      res.end();
      return;
    }
  }
  res.writeHead(302, {
    Location: '/login'
  });
  res.end();
}

module.exports = {
  renderHomePage,
  renderLoginPage,
  renderFiles,
  loginHandler
}