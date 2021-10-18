const pool = require('../utils/pool');
const Role = require('./Role');
const jwt = require('jsonwebtoken');

module.exports = class User {
    id;
    email;
    passwordHash;
    role;

    constructor(row) {
        this.id = row.id
        this.email = row.email
        this.passwordHash = row.password_hash
        this.role = row.role;
    }

    static async insert( email, passwordHash, roleTitle ) {
        const rock = await Role.findByTitle(roleTitle)
  

        const { rows } = await pool.query(
            'INSERT INTO users (email, password_hash, role_id) VALUES ($1, $2, $3) RETURNING *',
            [email, passwordHash, rock.id]
        );
    
        return new User({...rows[0], role: rock.title})
    }

    static async findEmails(email) {
        const { rows } = await pool.query(
            'SELECT * FROM users WHERE email=$1',
            [email]);

        if(!rows[0]) return null;

        const rock = await Role.findById(rows[0].role_id)

        return new User({...rows[0], role: rock.title});
    }

    static async findById(id) {

        const rock = await Role.findByTitle(rows[0].role_id)

        const { rows } = await pool.query(
            'SELECT * FROM users WHERE id= $1', 
            [id]);
            if(!rows[0]) return null;


            return new User({...rows[0], role: rock.title});
    }

    authToken() {
        return jwt.sign(this.toJSON(), process.env.APP_SECRET, {
            expiresIn: '24h'
        });
    }

    i

    toJSON() {
        return {
          id: this.id,
          email: this.email,
          role: this.role
        };
      }
}
