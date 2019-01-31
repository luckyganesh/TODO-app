const UTILS = "./utils.js";
const SEND_HANDLER = './send_handler.js';
const RENDER_PAGES = './renderPages.js';
const READ_OPTIONS = './readOptions.js';
const EXPRESS = './express.js';
const ENTITIES = './entities.js'
const COOKIES = './cookies.js';
const COOKIES_FILE = './src/cookies.json';
const ENCODING = "utf8";
const USERS_DATA = "./users";
const MIME_TEXT_PLAIN = 'text/plain';
const MIME_TYPES = {
  css: 'text/css',
  html: 'text/html',
  js: 'text/javascript',
  csv: 'text/csv',
  gif: 'image/gif',
  htm: 'text/html',
  html: 'text/html',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  json: 'application/json',
  png: 'image/png',
  xml: 'text/xml',
  pdf: 'application/pdf'
};

module.exports = {
  UTILS, SEND_HANDLER, RENDER_PAGES, READ_OPTIONS,
  EXPRESS,
  ENTITIES, COOKIES, COOKIES_FILE, ENCODING, USERS_DATA,MIME_TEXT_PLAIN,MIME_TYPES
}