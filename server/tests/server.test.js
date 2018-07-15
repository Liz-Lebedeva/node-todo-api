const request = require('supertest');
const {ObjectID} = require('mongodb');

const chai = require('chai');
chai.should();

const {app} = require('./../server');
const {ToDo} = require('./../models/todo');

/** Test data to restore DB content before each test */

const todosInitial = [{
    _id: new ObjectID(),
    text: 'First dummy todo'
}, {
    _id: new ObjectID(),
    text: 'Second dummy todo'
}, {
    _id: new ObjectID(),
    text: 'Third dummy todo'
}];

beforeEach( (done) => {
    ToDo.remove({}).then( () => {
        return ToDo.insertMany(todosInitial);
    }).then( () => done());
});

describe('POST /todos', () => {

    it('should create a new todo', (done) => {
        // Define test data
        const text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            // Check API's response
            .expect( (res) => {
                res.body.text.should.equal(text);
            })
            .end( (err, res) => {
                if (err) {
                    return done(err);
                }
                // Check that the record with test data was added to the DB (and only one)
                ToDo.find({text}).then( (result) => {
                    result.length.should.equal(1);
                    result[0].text.should.equal(text);
                    done();
                }).catch( (e) => done(e) );

            });
    });

    it('should not create a todo with no data', (done) => {
        // Define test data
        const text = ' ';

        request(app)
            .post('/todos')
            .send({text})
            // Check API's response
            .expect(400)
            .expect( (res) => {
                res.body.errors.should.not.be.null;
                res.body.message.should.include('ToDo cannot be empty');
            })
            .end( (err, res) => {
                if (err) {
                    return done(err);
                }

                // Check that no records with test data were added to the DB
                ToDo.find({text}).then( (result) => {
                    result.length.should.equal(0);
                    done();
                }).catch( (e) => done(e) );

            });
    });
});

describe('GET /todos', () => {

    it('should return all todos', (done) => {
        request(app)
            .get('/todos')
            // Check API's response
            .expect(200)
            .expect( (res) => {
                // Check that DB contains initial data from beforeEach block
                res.body.todos.length.should.equal(todosInitial.length);
                res.body.todos.map(a => a.text).should.deep.equal(todosInitial.map(a => a.text));
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {

    it('should find todo by its id and return it', (done) => {
        // Define test data
        const id = todosInitial[1]._id;  //.toHexString()

        request(app)
            .get(`/todos/${id}`)
            // Check API's response
            .expect(200)
            .expect( (res) => {
                // Check that returned record matches the one in initial data from beforeEach block
                res.body.todo.text.should.equal(todosInitial[1].text);
            })
            .end(done);
    });

    it('should return error message if there is no record with this id', (done) => {
        // Define test data
        const id = new ObjectID();  //.toHexString()

        request(app)
            .get(`/todos/${id}`)
            // Check API's response
            .expect(404)
            .expect( (res) => {
                // Check error message
                res.body.message.should.equal('ID not found');
            })
            .end(done);
    });

    it('should return error message if id is invalid', (done) => {
        // Define test data
        const id = 12345;

        request(app)
            .get(`/todos/${id}`)
            // Check API's response
            .expect(400)
            .expect( (res) => {
                // Check error message
                res.body.message.should.equal('ID is not valid');
            })
            .end(done);
    });
});

