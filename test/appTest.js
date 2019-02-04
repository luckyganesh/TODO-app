const request = require('supertest');
const fs = require('fs');
const data = {};

const USERS_FILE = './private/users.json';
const COOKIES_FILE = './private/cookies.json';

const emptyUsersAndCookiesFile = function () {
  data.cookies = fs.readFileSync(COOKIES_FILE, 'utf8');
  data.users = fs.readFileSync(USERS_FILE, 'utf8');
  fs.writeFileSync(COOKIES_FILE, '[]');
  fs.writeFileSync(USERS_FILE, '[]');
}

const fillUsersAndCookiesFile = function () {
  fs.writeFileSync(COOKIES_FILE, data.cookies);
  fs.writeFileSync(USERS_FILE, data.users);
}

emptyUsersAndCookiesFile();
const app = require('../src/app');

describe('app', () => {
  after(fillUsersAndCookiesFile);
  describe('/createNewUser', () => {
    it('if userId is not present, responds with status 0', (done) => {
      request(app)
        .post('/createNewUser')
        .send({ id: 'ganesh', name: 'ganesh', password: 'ganesh' })
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect(JSON.stringify({ status: 0 }))
        .end(done)
    });
    it('if userId is present, responds with status 1', (done) => {
      request(app)
        .post('/createNewUser')
        .send({ id: 'ganesh', name: 'ganesh', password: 'ganesh' })
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect(JSON.stringify({ status: 1 }))
        .end(done)
    })
  })
  let cookie;
  describe('/cookie', () => {
    it('should provide cookie and redirect to user main page', (done) => {
      request(app)
        .post('/cookie')
        .send('id=ganesh')
        .expect(302)
        .expect('set-cookie', /id=.*/)
        .expect((res) => {
          cookie = res.headers['set-cookie'][0];
        })
        .expect('Location', '/ganesh')
        .end(done)
    })
  });
  describe('get/login', () => {
    it('if cookie is not present, responds with login page', (done) => {
      request(app)
        .get('/login')
        .expect(200)
        .expect('Content-Type', /text\/html/)
        .expect(fs.readFileSync('./public/login.html', 'utf8'))
        .end(done)
    });
    it('if cookie is present but invalid, responds with login page', (done) => {
      request(app)
        .get('/login')
        .set('Cookie', 'id=784971029')
        .expect(200)
        .expect('Content-Type', /text\/html/)
        .expect(fs.readFileSync('./public/login.html', 'utf8'))
        .end(done)
    })
    it('if cookie is present and it is valid, redirects to user main page', (done) => {
      request(app)
        .get('/login')
        .set('Cookie', cookie)
        .expect(302)
        .expect('Location', '/ganesh')
        .end(done)
    })
  })
  describe('post/login', () => {
    it('if user is not present, responds with status 0', (done) => {
      request(app)
        .post('/login')
        .send({ id: 'sai', password: 'sai' })
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect(JSON.stringify({ status: 0 }))
        .end(done)
    })
    it('if user is present, responds with status 1', (done) => {
      request(app)
        .post('/login')
        .send({ id: 'ganesh', password: 'ganesh' })
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect(JSON.stringify({ status: 1 }))
        .end(done)
    })
  })
  describe('get /', () => {
    it('if cookie is not present, redirects to /login', (done) => {
      request(app)
        .get('/')
        .expect(302)
        .expect('Location', '/login')
        .end(done);
    })
    it('if cookie is present but invalid, responds with login page', (done) => {
      request(app)
        .get('/')
        .set('Cookie', 'id=784971029')
        .expect(302)
        .expect('Location', '/login')
        .end(done)
    })
    it('if cookie is present and it is valid, redirects to user main page', (done) => {
      request(app)
        .get('/')
        .set('Cookie', cookie)
        .expect(302)
        .expect('Location', '/ganesh')
        .end(done)
    })
  });
  describe('/logout', () => {
    it('it will make the cookie id to null and it will delete from cookies cache', (done) => {
      request(app)
        .get('/logout')
        .expect(302)
        .expect('Location', '/login')
        .expect('set-cookie', 'id=null')
        .end(done)
    })
  })
  describe('get /main.css', () => {
    it('gives the css with 200 & content type text/css', (done) => {
      request(app)
        .get('/main.css')
        .expect(200)
        .expect('Content-Type', /text\/css/)
        .expect(/html,body{/)
        .end(done);
    })
  })
})