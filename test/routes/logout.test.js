import chaiHttp from "chai-http/index.js";
import server from "../../server.js";
import jwt from "jsonwebtoken";
import { blacklist, addToBlacklist } from "../../routes/auth.js";

let chai;
await import("chai").then((result) => (chai = result.use(chaiHttp)));

chai.should();
const { expect } = chai;

const JWT_SECRET = process.env.JWT_SECRET;
const user = { id: '669ef955f2d651be269c1921' };
const token = jwt.sign({ userId: user.id }, JWT_SECRET, {expiresIn: "1h"})
// const blacklist = new Set();

describe('POST /auth/logout', () => {
  it('should logout successfully with a valid token', (done) => {
    chai.request(server)
      .post('/auth/logout')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.equal('Logged out successfully');
        expect(blacklist.has(token)).to.be.true;
        done();
      });
  });

  it('should return 401 for unauthorized request', (done) => {
    chai.request(server)
      .post('/auth/logout')
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it('should return 402 for already blacklisted token', (done) => {
    addToBlacklist(token);
    chai.request(server)
      .post('/auth/logout')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(402);
        done();
      });
  });

  it('should return 403 for invalid token', (done) => {
    const invalidToken = jwt.sign(user, 'invalid-secret', { expiresIn: '1h' });
    chai.request(server)
      .post('/auth/logout')
      .set('Authorization', `Bearer ${invalidToken}`)
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      });
  });
});