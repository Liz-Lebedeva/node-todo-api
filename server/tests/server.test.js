const request = require('supertest');
const {ObjectID} = require('mongodb');

const expect = require('chai').expect;

const {app} = require('./../server');
const {ToDo} = require('./../models/todo');

/** Test data to restore DB content before each test */

const todosInitial = [{
    _id: new ObjectID(),
    text: 'First dummy todo'
}, {
    _id: new ObjectID(),
    text: 'Second dummy todo',
    completed: true,
    completedAt: 1531642808200
}, {
    _id: new ObjectID(),
    text: 'Third dummy todo'
}];

beforeEach( (done) => {
    ToDo.remove({}).then( () => {
        return ToDo.insertMany(todosInitial);
    }).then( () => done() );
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
                // Check that returned record matches the one in initial data from beforeEach block
                expect(res.body.todo.text).to.equal(text);
            })
            .end( (err, res) => {
                if (err) {
                    return done(err);
                }
                // Check that the record with test data was added to the DB (and only one)
                ToDo.find({text}).then( (todos) => {
                    expect(todos.length).to.equal(1);
                    expect(todos[0].text).to.equal(text);
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
                // Check error message
                expect(res.body.errors).to.not.be.a('null');
                expect(res.body.message).to.include('ToDo cannot be empty');
            })
            .end( (err, res) => {
                if (err) {
                    return done(err);
                }

                // Check that no records with test data were added to the DB
                ToDo.find().then( (todos) => {
                    expect(todos.length).to.equal(todosInitial.length);
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
                expect(res.body.todos.length).to.equal(todosInitial.length);
                expect(res.body.todos.map(a => a.text)).to.deep.equal(todosInitial.map(a => a.text));
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {

    it('should find todo by its id and return it', (done) => {
        // Define test data
        const id = todosInitial[1]._id.toHexString();

        request(app)
            .get(`/todos/${id}`)
            // Check API's response
            .expect(200)
            .expect( (res) => {
                // Check that returned record matches the one in initial data from beforeEach block
                expect(res.body.todo._id).to.equal(id);
                expect(res.body.todo.text).to.equal(todosInitial[1].text); // optional
            })
            .end(done);
    });

    it('should return error message if todo not found by id', (done) => {
        // Define test data
        const id = new ObjectID().toHexString();

        request(app)
            .get(`/todos/${id}`)
            // Check API's response
            .expect(404)
            .expect( (res) => {
                // Check error message
                expect(res.body.message).to.equal('ID not found');
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
                expect(res.body.message).to.equal('ID is not valid');
            })
            .end(done);
    });

});

describe('PATCH /todos/:id', () => {

    it('should update todo text', (done) => {
        // Define test data
        const id = todosInitial[0]._id.toHexString();
        const text = 'updated test record';
        const body = {text: text};

        request(app)
            .patch(`/todos/${id}`)
            .send(body)
            // Check API's response
            .expect(200)
            .expect( (res) => {
                // Check that returned record matches the one in initial data from beforeEach block
                expect(res.body.todo._id).to.equal(id);
                expect(res.body.todo.text).to.equal(text);
            })
            .end( (err, res) => {
                if (err) {
                    return done(err);
                }

                // Check that record in the DB was updated
                ToDo.findById(id).then( (todo) => {
                    expect(todo.text).to.equal(text);
                    expect(todo.completed).to.be.false;
                    expect(todo.completedAt).to.be.a('null');
                    done();
                }).catch( (e) => done(e) );
            });
    });

    it('should update completedAt when todo is completed', (done) => {
        // Define test data
        const id = todosInitial[0]._id.toHexString();
        const body = {completed: true};

        request(app)
            .patch(`/todos/${id}`)
            .send(body)
            // Check API's response
            .expect(200)
            .expect( (res) => {
                // Check that returned record matches the one in initial data from beforeEach block
                expect(res.body.todo._id).to.equal(id); // optional
                expect(res.body.todo.completed).to.be.true;
                expect(res.body.todo.completedAt).to.be.a('number');
            })
            .end( (err, res) => {
                if (err) {
                    return done(err);
                }

                // Check that record in the DB was updated
                ToDo.findById(id).then( (todo) => {
                    expect(todo.text).to.equal(todosInitial[0].text);
                    expect(todo.completed).to.be.true;
                    expect(todo.completedAt).to.be.a('number');
                    done();
                }).catch((e) => done(e));
            });
    });


    it('should clear completedAt if completed is set to false', (done) => {
        // Define test data
        const id = todosInitial[1]._id.toHexString();
        const body = {completed : false};

        request(app)
            .patch(`/todos/${id}`)
            .send(body)
            // Check API's response
            .expect(200)
            .expect( (res) => {
                // Check that returned record matches the one in initial data from beforeEach block
                expect(res.body.todo._id).to.equal(id); // optional
                expect(res.body.todo.completed).to.be.false;
                expect(res.body.todo.completedAt).to.be.a('null');
            })
            .end( (err, res) => {
                if (err) {
                    return done(err);
                }

                // Check that record in the DB was updated
                ToDo.findById(id).then((todo) => {
                    expect(todo.text).to.equal(todosInitial[1].text);
                    expect(todo.completed).to.be.false;
                    expect(todo.completedAt).to.be.a('null');
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return error message if todo not found by id', (done) => {
        // Define test data
        const id = new ObjectID().toHexString();
        const body = {completed: true};

        request(app)
            .patch(`/todos/${id}`)
            .send(body)
            // Check API's response
            .expect(404)
            .expect( (res) => {
                // Check error message
                expect(res.body.message).to.equal('ID not found');
            })
            .end(done);
    });

    it('should return error message if id is invalid', (done) => {
        // Define test data
        const id = 12345;
        const body = {completed: true};

        request(app)
            .patch(`/todos/${id}`)
            .send(body)
            // Check API's response
            .expect(400)
            .expect( (res) => {
                // Check error message
                expect(res.body.message).to.equal('ID is not valid');
            })
            .end(done);
    });

});


describe('DELETE /todos/:id', () => {

    it('should delete a todo by its id', (done) =>{
        // Define test data
        const id = todosInitial[1]._id.toHexString();

        request(app)
            .delete(`/todos/${id}`)
            // Check API's response
            .expect(200)
            .expect( (res) => {
                // Check that returned record matches the one in initial data from beforeEach block
                expect(res.body.todo._id).to.equal(id);
                expect(res.body.todo.text).to.equal(todosInitial[1].text); // optional
            })
            .end( (err, res) => {
                if (err) {
                    return done(err);
                }
                // Check that the record with test data was deleted from the DB (and only it)
                ToDo.find().then( (todos) => {
                    expect(todos.length).to.equal(todosInitial.length - 1);
                    expect(todos.map(a => a._id)).to.not.include({_id : id});
                    done();
                }).catch( (e) => done(e) );
            });
    });

    it('should return error message if todo not found by id', (done) => {
        // Define test data
        const id = new ObjectID().toHexString();

        request(app)
            .delete(`/todos/${id}`)
            // Check API's response
            .expect(404)
            .expect( (res) => {
                // Check error message
                expect(res.body.message).to.equal('ID not found');
            })
            .end(done);
    });

    it('should return error message if id is invalid', (done) => {
        // Define test data
        const id = 12345;

        request(app)
            .delete(`/todos/${id}`)
            // Check API's response
            .expect(400)
            .expect( (res) => {
                // Check error message
                expect(res.body.message).to.equal('ID is not valid');
            })
            .end(done);
    });
});
