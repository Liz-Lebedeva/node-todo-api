# To Do Application

This is an educational project I did for a [The Complete Node.js Developer Course (2nd Edition)](https://www.udemy.com/the-complete-nodejs-developer-course-2/learn/v4/overview)  
It is a REST API that allows registered users with an account to create and maintain their To Do lists.

## Endpoints

### /users

**Allowed HTTPs requests:**  
**POST** - Creates a new user, assigns authentication token  

**Usual Server Responses:**  
200 - `OK` - the request was successful  
400 - `Bad Request` - the request could not be understood or was missing required parameters  

**Sample request:**  
body:  
```
{
  "email" : "test.user.two@gmail.com",
  "password" : "123456"
}
```

**Sample response:**  
headers:  
```
{
    'x-auth': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YjUzNzMzYmM5OTk4MjE2Y2FiYzJiY2UiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTMyMTk2NTA3fQ.YjLnPu2UDajhVAX47X4DsLAMG0Dojt7HpDoSiThTwlM'
}
```
body (JSON):  
```
{
    "_id": "5b53733bc9998216cabc2bce",
    "email": "test.user.two@gmail.com"
}
```


### /users/login

**Allowed HTTPs requests:**  
**POST** - Logs in an existing user, assigns new authentication token  

**Usual Server Responses:**  
200 - `OK` - the request was successful  
400 - `Bad Request` - the request could not be understood or was missing required parameters  

**Sample request:**  
body:  
```
{
  "email" : "test.user.two@gmail.com",
  "password" : "123456"
}
```

**Sample response:**  
headers:  
```
{
    'x-auth': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YjUzNzMzYmM5OTk4MjE2Y2FiYzJiY2UiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTMyMTk2NTA3fQ.YjLnPu2UDajhVAX47X4DsLAMG0Dojt7HpDoSiThTwlM'
}
```
body (JSON):  
status: 200  
```
{
    "_id": "5b53733bc9998216cabc2bce",
    "email": "test.user.two@gmail.com"
}
```

### /users/me

**Allowed HTTPs requests:**  
**GET** - Returns user's ID and email, if authentication token is valid  

**Usual Server Responses:**  
400 `Bad Request` - the request could not be understood or was missing required parameters  
401 `Unauthorized` - authentication failed  

**Sample request:**  
headers:  
```
{
    'x-auth': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YjUzNzMzYmM5OTk4MjE2Y2FiYzJiY2UiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTMyMTk2NTA3fQ.YjLnPu2UDajhVAX47X4DsLAMG0Dojt7HpDoSiThTwlM'
}
```

**Sample response:**  
status: 200  
body:  
```
{
    "_id": "5b53733bc9998216cabc2bce",
    "email": "test.user.two@gmail.com"
}
```


### /users/me/token

**Allowed HTTPs requests:**  
**DELETE** - Logs the user out, deleting authentication token  

*Usual Server Responses:*  
200 `OK` - the request was successful  
400 `Bad Request` - the request could not be understood or was missing required parameters  
401 `Unauthorized` - authentication failed  

**Sample request:**  
headers:  
```
{
    'x-auth': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YjUzNzMzYmM5OTk4MjE2Y2FiYzJiY2UiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTMyMTk2NTA3fQ.YjLnPu2UDajhVAX47X4DsLAMG0Dojt7HpDoSiThTwlM'
}
```

**Sample response:**  
status: 200  


### /todos

**Allowed HTTPs requests:**  
**POST** - Adds a new To Do record associated with the user  

**Usual Server Responses:**  
200 `OK` - the request was successful  
400 `Bad Request` - the request could not be understood or was missing required parameters  
401 `Unauthorized` - authentication failed  

**Sample request:**  
headers:  
```
{
    'x-auth': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YjUzNzMzYmM5OTk4MjE2Y2FiYzJiY2UiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTMyMTk2NTA3fQ.YjLnPu2UDajhVAX47X4DsLAMG0Dojt7HpDoSiThTwlM'
}
```
body:  
```
{
  "text" : "Buy milk, bread and cherries"
}
```

**Sample response:**  
status: 200  
body:  
```
{
    "todo": {
        "completed": false,
        "completedAt": null,
        "_id": "5b537357c9998216cabc2bd3",
        "text": "Forth todo from second user",
        "_creator": "5b53733bc9998216cabc2bce",
        "__v": 0
    }
}
```

**GET** - Returns all To Do records associated with the user

**Usual Server Responses:**  
200 `OK` - the request was successful  
400 `Bad Request` - the request could not be understood or was missing required parameters  
401 `Unauthorized` - authentication failed  

**Sample request:**  
headers:  
```
{
    'x-auth': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YjUzNzMzYmM5OTk4MjE2Y2FiYzJiY2UiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTMyMTk2NTA3fQ.YjLnPu2UDajhVAX47X4DsLAMG0Dojt7HpDoSiThTwlM'
}
```

**Sample response:**  
status: 200  
body:  
```
{
    "todos": [
        {
            "completed": false,
            "completedAt": null,
            "_id": "5b537347c9998216cabc2bd0",
            "text": "First todo from second user",
            "_creator": "5b53733bc9998216cabc2bce",
            "__v": 0
        },
        {
            "completed": false,
            "completedAt": null,
            "_id": "5b53734dc9998216cabc2bd1",
            "text": "Second todo from second user",
            "_creator": "5b53733bc9998216cabc2bce",
            "__v": 0
        },
    ]
}
```


### /todos/:id

**Allowed HTTPs requests:**  
**GET** - Returns one To Do by its ID  

**Usual Server Responses:**  
200 `OK` - the request was successful  
400 `Bad Request` - the request could not be understood or was missing required parameters  
401 `Unauthorized` - authentication failed  
404 `Not Found` - resource was not found  

**Sample request:**  
parameters: record id (MongoDB _id, required)  
headers:  
```
{
    'x-auth': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YjUzNzMzYmM5OTk4MjE2Y2FiYzJiY2UiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTMyMTk2NTA3fQ.YjLnPu2UDajhVAX47X4DsLAMG0Dojt7HpDoSiThTwlM'
}
```

**Sample response:**  
status: 200  
body:  
```
{
    "todo": {
        "completed": true,
        "completedAt": 1532195748431,
        "_id": "5b5372fac9998216cabc2bc8",
        "text": "First todo from first user",
        "_creator": "5b5372e1c9998216cabc2bc6",
        "__v": 0
    }
}
```

**PATCH** - Modifies one To Do by its ID. Can be used to change text or set To Do as completed (if set completed, adds a time stamp; is completed set to false, removes time stamp if it exists)

**Usual Server Responses:**  
200 `OK` - the request was successful  
400 `Bad Request` - the request could not be understood or was missing required parameters  
401 `Unauthorized` - authentication failed  
404 `Not Found` - resource was not found  

**Sample request:**  
parameters: record id (MongoDB _id, required)  
headers:  
```
{
    'x-auth': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YjUzNzMzYmM5OTk4MjE2Y2FiYzJiY2UiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTMyMTk2NTA3fQ.YjLnPu2UDajhVAX47X4DsLAMG0Dojt7HpDoSiThTwlM'
}
```
body:  
```
{
	"text": "oups!",
	"completed": true
}
```

**Sample response:**  
status: 200  
body:  
```
{
    "todo": {
        "completed": true,
        "completedAt": 1532204263618,
        "_id": "5b537314c9998216cabc2bcb",
        "text": "oups!",
        "_creator": "5b5372e1c9998216cabc2bc6",
        "__v": 0
    }
}
```

**DELETE** - Deletes one To Do by its ID. Returns deleted To Do record.  

*Usual Server Responses:*  
200 `OK` - the request was successful  
400 `Bad Request` - the request could not be understood or was missing required parameters  
401 `Unauthorized` - authentication failed  
404 `Not Found` - resource was not found  

**Sample request:**  
parameters: record id (MongoDB _id, required)  
headers:  
```
{
    'x-auth': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YjUzNzMzYmM5OTk4MjE2Y2FiYzJiY2UiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTMyMTk2NTA3fQ.YjLnPu2UDajhVAX47X4DsLAMG0Dojt7HpDoSiThTwlM'
}
```

**Sample response:**  
status: 200  
body:  
```
{
    "todo": {
        "completed": true,
        "completedAt": 1532204263618,
        "_id": "5b537314c9998216cabc2bcb",
        "text": "oups!",
        "_creator": "5b5372e1c9998216cabc2bc6",
        "__v": 0
    }
}
```

## Deployment notes
To Do Application is currently deployed on Heroku [here](https://invulnerable-fromage-32368.herokuapp.com/) so you could try it.  
(Please note that 1st request may be processed with 10-20 seconds delay as it is a sandbox)


## Cloning notes

If you want to clone this repo and run it on your local machine you need to add a JSON configuration file in Server folder, specifying PORT (number), MONGODB_URI(MongoDB connection URI) and JWT_SECRET(String) environment variables for 'test' and 'development' environments
Example:  
```
{
  "development": {
    "PORT": 3000,
    "MONGODB_URI": "mongodb://<dbuser>:<dbpassword>@ds125381.mlab.com:25441/todos",
    "JWT_SECRET": "kslP79qcvy7phg54w"
  },
  "test": {
    "PORT": 3000,
    "MONGODB_URI": "mongodb://<dbuser>:<dbpassword>@ds125381.mlab.com:28981/test-todos",
    "JWT_SECRET": "gksldjl8899sklkld"
  }
}
```

## Running the tests

Component tests are done with Mocha framework and Chai assertion library. You can run the tests with `npm test` command.


## Built With

* [mongodb](http://mongodb.github.io/node-mongodb-native/) - Node.JS driver for MongoDB
* [mongoose](http://mongoosejs.com/) - Elegant MongoDB object modeling for Node.js
* [express](http://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js
* [supertest](https://www.npmjs.com/package/supertest) - HTTP assertions
* [body-parser](https://www.npmjs.com/package/body-parser) - Node.js body parsing middleware
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - JSON Web Tokens
* [bcryptjs](https://www.npmjs.com/package/bcryptjs) - Hashing passwords
* [validator](https://www.npmjs.com/package/validator) - Library of string validators
* [lodash](https://www.npmjs.com/package/lodash) - Utility library
* [mocha](https://mochajs.org/) - Test framework
* [chai](http://www.chaijs.com/) - Assertion library
