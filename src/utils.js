const splitKeyValue = pair => pair.split('=');

const placeInObject = function (object, keyValuePair) {
  let [key, value] = splitKeyValue(keyValuePair);
  object[key] = value;
  return object;
}

const logRequest = function (req, res, next) {
  console.log(req.method, req.url);
  next();
}

module.exports = {
  placeInObject,
  logRequest
}