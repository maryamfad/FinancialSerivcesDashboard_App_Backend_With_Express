import chai from 'chai';
import chaiHttp from 'chai-http';
import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {authMiddleware} from '../../routes/auth.js'; 

dotenv.config();

chai.use(chaiHttp);
const { expect } = chai;

const JWT_SECRET = process.env.JWT_SECRET;

const app = express();
app.use(express.json());
app.use(authMiddleware);

app.get('/protected', (req, res) => {
  res.status(200).json({ message: 'Protected resource accessed' });
});

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

describe('Auth Middleware Tests', () => {
  it('should allow access with a valid token', (done) => {
    const token = generateToken({ id: '12345', username: 'testuser' });

    chai.request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) return done(err);
        
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message').eql('Protected resource accessed');
        done();
      });
  });

  it('should deny access with an invalid token', (done) => {
    const invalidToken = 'invalidtoken';

    chai.request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${invalidToken}`)
      .end((err, res) => {
        if (err) return done(err);
        
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error').eql('Invalid token');
        done();
      });
  });

  it('should deny access without a token', (done) => {
    chai.request(app)
      .get('/protected')
      .end((err, res) => {
        if (err) return done(err);
        
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('error').eql('Access denied');
        done();
      });
  });
});