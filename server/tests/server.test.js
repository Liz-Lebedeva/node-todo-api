const request = require('supertest');
const chai = require('chai');
chai.should();

const {app} = require('./../server');
const {ToDo} = require('./../models/todo');

/** Test data to restore DB content before each test */

const todosInitial = [{
    text: 'First dummy todo'
}, {
    text: 'Second dummy todo'
}, {
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
            .expect(200)
            .expect( (res) => {
                // Check that DB contains inital data from beforeEach block
                res.body.todos.length.should.equal(todosInitial.length);
                res.body.todos.map(a => a.text).should.deep.equal(todosInitial.map(a => a.text));
            })
            .end(done);
    })


});