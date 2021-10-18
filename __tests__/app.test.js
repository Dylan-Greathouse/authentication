const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');
const UserService = require('../lib/services/UserServ.js');



describe('alchemy-app routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

 

  it('posts new user to DB', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'test@emai.com',
        password: 'fake-passwor',
        role: 'PALADIN'
      });
    expect(res.body).toEqual({
      id: expect.any(String),
      email: 'test@emai.com',
      role: 'PALADIN'
    });
  });



  it('checks for existing users', async () => {
    await UserService.createUser({
      email: 'test@emai.com',
      password: 'fake-passwor',
      roleTitle: 'PALADIN'
    });
 
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'test@emai.com',
        password: 'fake-passwor',
        roleTitle: 'PALADIN'
      });
    
    expect(res.body).toEqual({
      message: 'User already exists',
      status: 400
    });
  });

  it('logs existing user in via post route', async () => {
    // jest.setTimeout(10000);
    await UserService.createUser({
      email: 'test@emai.com',
      password: 'fake-passwor',
      roleTitle: 'BARD'
    });
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ 
        email: 'test@emai.com',
        password:'fake-passwor',
        roleTitle: 'BARD'
      });

    expect(res.body).toEqual({
      id: expect.any(String),
      email: 'test@emai.com',
      role: 'BARD'
    });
  });

  it('ensures login credentials exist in DB', async () => {
    await UserService.createUser({
      email: 'test@emai.com',
      password: 'fake-passwor',
      roleTitle: 'MAGE'
    });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@emai.com',
        password:'passwor',
        roleTitle: 'MAGE' 
      });
   
    expect(res.body).toEqual({
      message: 'Invalid email/password',
      status: 401 }
    );
  });

  it('gets user currently logged in using cookie at /me', async () => {
    await UserService.createUser({
      email: 'test@emai.com',
      password: 'fake-passwor',
      roleTitle: 'CLERIC'
    });

    const agent = await request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'test@emai.com',
        password:'fake-passwor',
        roleTitle: 'CLERIC'
      });

    const res = await agent
      .get('/api/v1/auth/me');

    expect(res.body).toEqual({
      id: expect.any(String),
      exp: expect.any(Number),
      iat: expect.any(Number),
      email: 'test@emai.com',
      role: 'CLERIC'
    });
  });


  afterAll(() => {
    pool.end();
  });
});
