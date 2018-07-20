require('./config/config');

const _ = require('lodash');
const express = require('express');

const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const mongoose = require('./db/mongoose');
const {authenticate} = require('./middleware/authenticate');
const {ToDo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());


/** USERS routes */

app.post('/users', (req, res) => {

    const body = _.pick(req.body, ['email', 'password']); // todo: add other keys when they will be used
    const user = new User(body);

    user.save()
        .then( () => {
            return user.generateAuthToken();
        })
        .then( (token) => {
            res.header('x-auth', token).send(user);
        })
        .catch( (e) => {
            res.status(400).send(e);
        });

});

app.post('/users/login', (req, res) => {

    const body = _.pick(req.body, ['email', 'password']); // todo: add other keys when they will be used
    //const user = new User(body);

    User.findByCredentials(body.email, body.password).then( (user) => {
        return user.generateAuthToken().then( (token) => {
            res.header('x-auth', token).send(user);
        });

    }).catch( (e) => {
        res.status(400).send(e);
    });

});

app.get('/users/me', authenticate, (req, res) => {

    res.send(req.user);

});

app.delete('/users/me/token', authenticate, (req,res) => {

    req.user.removeToken(req.token).then( () => {
       res.status(200).send();
    }, () => {
        res.status(400).send();
    });

});


/** RECORDS routes */

app.post('/todos', (req, res) => {

    const body = _.pick(req.body, ['text']);
    const todo = new ToDo(body);

    todo.save().then( (todo) => {
        res.send({todo});
    }).catch( (e) => {
        res.status(400).send(e);
    });

});

app.get('/todos', (req, res) => {

   ToDo.find().then( (todos) => {
       // respond with an object that contains array of results to be able to add another properties to the response
       res.send({todos});
   }).catch( (e) => {
       res.status(400).send(e);
   });

});

app.get('/todos/:id', (req, res) => {

    const id = req.params.id;

    if ( !ObjectID.isValid(id) ) {
        return res.status(400).send({message: 'ID is not valid'});
    }

    ToDo.findById(id).then ( (todo) => {
        if (!todo) {
            return res.status(404).send({message: 'ID not found'});
        }
        res.send({todo});
    }).catch( (e) => {
        res.status(400).send({message: 'Unknown error'});
    });

});

app.patch('/todos/:id', (req, res) => {

    const id = req.params.id;
    const body = _.pick(req.body, ['text', 'completed']);

    if ( !ObjectID.isValid(id) ) {
        return res.status(400).send({message: 'ID is not valid'});
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    ToDo.findByIdAndUpdate(id, {$set: body}, {new: true}).then( (todo) => {
        if (!todo) {
            return res.status(404).send({message: 'ID not found'});
        }
        res.send({todo});
    }).catch( (e) => {
        res.status(400).send({message: 'Unknown error'});
    });

});

app.delete('/todos/:id', (req, res) => {

    const id = req.params.id;

    if ( !ObjectID.isValid(id) ) {
        return res.status(400).send({message: 'ID is not valid'});
    }

    ToDo.findByIdAndDelete(id).then ( (todo) => {
        if (!todo) {
            return res.status(404).send({message: 'ID not found'});
        }
        res.send({todo});
    }).catch( (e) => {
        res.status(400).send({message: 'Unknown error'});
    });

});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};