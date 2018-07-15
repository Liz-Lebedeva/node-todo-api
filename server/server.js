const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {ToDo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {

    const todo = new ToDo({
        text: req.body.text
    });
    todo.save().then( (doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });

});

app.get('/todos', (req, res) => {

   ToDo.find().then( (todos) => {
       // respond with an object that contains array of results
       // to be able to add another properties to the response
       res.send({todos});
   }, (e) => {
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

    }, (e) => {
        res.status(400).send({message: 'Unknown error'});
    });

});

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = {app};