const splitKeyValue = pair => pair.split('=');

const placeInObject = function (object, keyValuePair) {
  let [key, value] = splitKeyValue(keyValuePair);
  object[key] = value;
  return object;
}

const addPrefix = (url) => `./public${url}`;

const getExtension = function (fileName) {
  return fileName.split('.').pop();
}

const getType = function (fileName) {
  const type = getExtension(fileName);
  return MIME_TYPES[type] || MIME_TEXT_PLAIN;
}

const redirect = function (res, location) {
  res.writeHead(302, { Location: location });
  res.end();
}

const logRequest = function (req, res, next) {
  console.log(req.method, req.url);
  next();
}

module.exports = {
  placeInObject,
  logRequest,
  redirect,
  addPrefix,
  getType
}