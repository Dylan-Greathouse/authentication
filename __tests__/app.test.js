const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');

describe('alchemy-app routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('post a new user to table Users', async () => {
    return request(app).post('/auth/signup').then();
  });

  afterAll(() => {
    pool.end();
  });
});
