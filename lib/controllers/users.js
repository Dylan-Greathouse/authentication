const { Router } = require('express');
const ensureAuth = require('../middleware/ensure.js');

const UserService = require('../services/UserServ.js');

module.exports = Router()
  .post('/signup', async (req, res, next) => {
    try{
      const user = await UserService.createUser({ ...req.body, roleTitle: 'PALADIN' });


      res.cookie('userId', user.authToken(), {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
      });
      res.send(user);
    } catch (err) {
      err.status = 400;
      next(err);
    }
  })
  


  .post('/login', async (req, res, next) => {
    try{
      const user = await UserService.auth(req.body);

      res.cookie('userId', user.authToken(), {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24      
      });

      res.send(user);
    } catch (err) {
      err.status = 401;
      next(err);
    }
  })

  .get('/me', ensureAuth, async (req, res, next) => {
    try {
  
      res.send(req.user);
    } catch(err) {
      next(err);
    }
  });
  
