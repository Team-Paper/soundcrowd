/* eslint-disable no-unused-expressions */
/* global describe beforeEach it */

const { expect } = require('chai');
const request = require('supertest');
const db = require('../db');
const app = require('../index');

const User = db.model('user');

describe('User routes', () => {
  beforeEach(() => db.sync({ force: true }));

  describe('/api/users/', () => {
    const testUser = {
      username: 'Test User',
      email: 'test@test.com',
    };

    beforeEach(() => User.create(testUser));

    it('GET /api/users', () => request(app)
      .get('/api/users')
      .expect(200)
      .then((res) => {
        expect(res.body).to.be.an('array');
        expect(res.body[0].username).to.be.equal('Test User');
        // exclude emails in user list
        expect(res.body[0].email).to.be.undefined;
      }));
  }); // end describe('/api/users')
}); // end describe('User routes')
