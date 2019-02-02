const send = function (res, statusCode, message, contentType) {
  contentType && res.setHeader('Content-Type', contentType);
  //res.contentType = contentType;
  res.statusCode = statusCode;
  res.write(message);
  res.end();
}

const sendNotFound = function (req, res) {
  send(res, 404, "Not Found", 'text/plain');
}

module.exports = {
  send, sendNotFound
}