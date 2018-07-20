const request = require('supertest');
// const {ObjectID} = require('mongodb');

const expect = require('chai').expect;

const {app} = require('./../server');
const {User} = require('./../models/user');
const {usersInitial, populateUsers} = require('./seed/seed');

/** Test data to restore DB content before each test */

beforeEach(populateUsers);

/** Tests */

describe('POST /users', () => {

    it('should create a new user', (done) => {
        // Define test data
        const email = 'new.test.email@example.com';
        const password = 'qwerty';

        request(app)
            .post('/users')
            .send({email, password})
            // Check API's response
            .expect(200)
            .expect( (res) => {
                expect(res.headers['x-auth']).to.exist;
                expect(res.body._id).to.exist;
                expect(res.body.email).to.equal(email);
            })
            .end( (err, res) => {
                if (err) {
                    return done(err);
                }

                // Check that user was added to the DB
                User.find({email}).then( (users) => {
                    expect(users.length).to.equal(1);
                    done();
                }).catch( (e) => done(e) );
            });
    });

    it('should not create a user if email already used', (done) => {
        // Define test data
        const email = usersInitial[0].email;
        const password = 'qwerty';

        request(app)
            .post('/users')
            .send({email, password})
            // Check API's response
            .expect(400)
            .expect( (res) => {
                expect(res.body.message).to.include('duplicate key error');
            })
            .end(done);
    });

    it('should return validation error if email is incorrect', (done) => {
        // Define test data
        const email = 'new.test.email';
        const password = 'qwerty';

        request(app)
            .post('/users')
            .send({email, password})
            // Check API's response
            .expect(400)
            .expect( (res) => {
                expect(res.body.message).to.include(`${email} is not a valid email`);
            })
            .end(done);
    });

    it('should return validation error if password is incorrect', (done) => {
        // Define test data
        const email = 'new.test.email@gmail.com';
        const password = '12345';

        request(app)
            .post('/users')
            .send({email, password})
            // Check API's response
            .expect(400)
            .expect( (res) => {
                expect(res.body.message).to.include('shorter than the minimum allowed length');
            })
            .end(done);
    });

});

describe('POST /users/login', () => {

    it('should login user with valid credentials and return auth token', (done) => {
        // Define test data
        const email = usersInitial[1].email;
        const password = usersInitial[1].password;
        const id = usersInitial[1]._id;

        request(app)
            .post('/users/login')
            .send({email, password})
            // Check API's response
            .expect(200)
            .expect( (res) => {
                expect(res.headers['x-auth']).to.exist;
                expect(res.body._id).to.equal(id.toHexString());
                expect(res.body.email).to.equal(email);
            })
            .end( (err, res) => {
                if (err) {
                    return done (err);
                }
                // Check that user in the DB has new tokens
                User.findById(id).then( (user) => {
                    expect(user.tokens[0]).includes({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch( (e) => done(e) );
            });
    });

    it('should return reject invalid credentials', (done) => {
        // Define test data
        const email = 'not.used.email@gmail.com';
        const password = usersInitial[1].password;
        const id = usersInitial[1]._id;

        request(app)
            .post('/users/login')
            .send({email, password})
            // Check API's response
            .expect(400)
            .expect( (res) => {
                expect(res.headers['x-auth']).to.not.exist;
                expect(res.body.message).to.include('User not found');
            })
            .end(done);
    });

    it('should return reject invalid password', (done) => {
        // Define test data
        const email = usersInitial[1].email;
        const password = '12345';
        const id = usersInitial[1]._id;

        request(app)
            .post('/users/login')
            .send({email, password})
            // Check API's response
            .expect(400)
            .expect( (res) => {
                expect(res.headers['x-auth']).to.not.exist;
                expect(res.body.message).to.include('error');
            })
            .end( (err, res) => {
                if (err) {
                    return done (err);
                }
                // Check that user in the DB still has no tokens
                User.findById(id).then( (user) => {
                    expect(user.tokens.length).to.equal(0);
                    done();
                }).catch( (e) => done(e) );
            });
    });

});

describe('GET /users/me', () => {

    it('should return user if authenticated', (done) => {
        // Define test data
        const token = usersInitial[0].tokens[0].token;
        const id = usersInitial[0]._id;
        const email = usersInitial[0].email;

        request(app)
            .get('/users/me')
            .set('x-auth', token)
            // Check API's response
            .expect(200)
            .expect( (res) => {
                expect(res.body._id).to.equal(id.toHexString());
                expect(res.body.email).to.equal(email);
            })
            .end(done);
    });

    it('should return 401 error if not authenticated', (done) => {
        // Define test data
        const token = '';

        request(app)
            .get('/users/me')
            .set('x-auth', token)
            // Check API's response
            .expect(401)
            .expect( (res) => {
                expect(res.body.message).to.equal('Unknown authentication error');
            })
            .end(done);
    });

});

describe('DELETE /users/me/token', () => {

    it('should delete auth token on logout if authenticated', (done) => {
        // Define test data
        const token = usersInitial[0].tokens[0].token;
        const id = usersInitial[0]._id;

        request(app)
            .delete('/users/me/token')
            .set('x-auth', token)
            // Check API's response
            .expect(200)
            .end( (err, res) => {
                if (err) {
                    return done (err);
                }
                // Check that user in the DB has no tokens
                User.findById(id).then( (user) => {
                    expect(user.tokens.length).to.equal(0);
                    done();
                }).catch( (e) => done(e) );
            });
    });

});