const request = require('supertest');
const app = require('../src/app');
describe('app', () => {
  describe('get /', () => {
    it('without cookie, redirects to /login', (done) => {
      request(app)
        .get('/')
        .expect(302)
        .expect('Location', '/login')
        .end(done);
    })
  })
  describe('get /main.css', () => {
    it('without cookie, gives the css with 200 & content type text/css', (done) => {
      request(app)
        .get('/main.css')
        .expect(200)
        .expect('Content-Type', /text\/css/)
        .expect(/html,body{/)
        .end(done);
    })
  })
})