const { send, sendNotFound } = require('./send_handler.js');

const renderFiles = function(fs, req, res) {
  let filePath = `./public${req.url}`;
  fs.readFile(filePath, (err, content) => {
    if(err){
      sendNotFound(req, res);
      return ;
    }
    send(res, 200, content, "text/html");
  })
}

const renderLoginPage = function (fs, req, res) {
  fs.readFile('./public/index.html', (err, content) => {
    if (err) {
      sendNotFound(req, res);
      return;
    }
    send(res, 200, content, 'text/html');
  })
}

const renderHomePage = function (req, res) {
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