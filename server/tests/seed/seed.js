const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {ToDo} = require('./../../models/todo');
const {User} = require('./../../models/user');

/** Todos */

const todosInitial = [{
    _id: new ObjectID(),
    text: 'First dummy todo',
}, {
    _id: new ObjectID(),
    text: 'Second dummy todo',
    completed: true,
    completedAt: 1531642808200,
}, {
    _id: new ObjectID(),
    text: 'Third dummy todo',
}];

const populateToDos = (done) => {
    ToDo.remove({}).then( () => {
        return ToDo.insertMany(todosInitial);
    }).then( () => done() );
};


/** Users */

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const usersInitial = [{
    _id: userOneId,
    email: 'test.user.one@gmail.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc1234').toString(),
        // todo: move value to config file
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
    }).then( () => done() );
};

module.exports = {todosInitial, populateToDos, usersInitial, populateUsers};