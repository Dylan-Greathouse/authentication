const User = require('../models/User.js');
const bcrypt = require('bcryptjs');

module.exports = class UserServ {
  static async create({ email, password }) {
    const oldUser = await User.findByEmail(email);

    if (oldUser) {
      const error = new Error();
      error.status = 400;
      error.message = 'User has already made account!';
      throw error;
    }

    const passwordHash = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );

    const user = await User.insert({ email, passwordHash });

    return user;
  }

  static async authorize({ email, password }) {
    const oldUser = await User.findByEmail(email);

    if (!oldUser) {
      const error = new Error();
      error.status = 401;
      error.message = 'User info doesn\'t match an account!';
      throw error;
    }

    const passwordsMatch = await bcrypt.compare(
      password,
      oldUser.passwordHash
    );

    if (!passwordsMatch) {
      throw new Error('Invalid account');
    }

    return oldUser;
  }
};
