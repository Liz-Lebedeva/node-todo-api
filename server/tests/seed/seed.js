const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {ToDo} = require('./../../models/todo');
const {User} = require('./../../models/user');


/** Users */

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const usersInitial = [{
    _id: userOneId,
    email: 'test.user.one@gmail.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString(),
    }],
},{
    _id: userTwoId,
    email: 'test.user.two@gmail.com',
    password: 'userTwoPass',

}];

const populateUsers = (done) => {
    User.remove({}).then( () => {
        const userOne = new User(usersInitial[0]).save();
        const userTwo = new User(usersInitial[1]).save();

        return Promise.all([userOne, userTwo]);
    }).then( () => done() ).catch( (e) => done(e) );
};


/** Records */

const todosInitial = [{
    _id: new ObjectID(),
    text: 'First dummy todo',
    _creator: userOneId,
}, {
    _id: new ObjectID(),
    text: 'Second dummy todo',
    completed: true,
    completedAt: 1531642808200,
    _creator: userOneId,
}, {
    _id: new ObjectID(),
    text: 'Third dummy todo',
    _creator: userTwoId,
}];

const populateToDos = (done) => {
    ToDo.remove({}).then( () => {
        return ToDo.insertMany(todosInitial);
    }).then( () => done() ).catch( (e) => done(e) );
};



module.exports = {todosInitial, populateToDos, usersInitial, populateUsers};