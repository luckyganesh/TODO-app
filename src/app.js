const fs = require('fs');
const { Express } = require('./express.js');

const app = new Express();

const { logRequest } = require("./utils.js");
const { sendNotFound } = require('./send_handler.js');
const { renderHomePage, renderLoginPage, renderFiles } = require('./renderPages.js');

app.use(logRequest);
app.get('/login', renderLoginPage.bind(null, fs));
app.get('/', renderHomePage);
app.use(renderFiles.bind(null, fs));
app.use(sendNotFound);

module.exports = app.requestHandler.bind(app);