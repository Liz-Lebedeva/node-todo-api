const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {ToDo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {

    const todo = new ToDo({
        text: req.body.text
    });

    todo.save().then( (todo) => {
        res.send(todo);
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