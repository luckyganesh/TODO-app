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

const loginHandler = function(fs,cookies,req, res) {
  let date = new Date().getTime();
  cookies.push(date);
  res.setHeader("Set-Cookie", `id=${date}`);
  res.writeHead(302, {
    Location: '/'
  });
  res.end();
  fs.writeFile('./src/cookies.json',JSON.stringify(cookies),(err) => console.log(err));
};

const renderLoginPage = function (fs, req, res) {
  fs.readFile('./public/index.html', (err, content) => {
    if (err) {
      sendNotFound(req, res);
      return;
    }
    send(res, 200, content, 'text/html');
  })
}

const renderHomePage = function (fs, cookies, req, res) {
  console.log(cookies);
  const id = +req.cookies.id;
  if (id) {
    if (cookies.includes(id)) {
      console.log(id);
      console.log('it came');
      res.end();
      return;
    }
  }
  res.writeHead(302,{
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