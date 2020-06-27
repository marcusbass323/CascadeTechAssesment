//THIS IS A SERVER BASED APPLICATION

//PORT
const PORT = process.env.PORT || 7000;

//DEPENDENCIES
const express = require('express');
const server = express();
const knex = require('knex');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const moment = require('moment');
var cookieParser = require('cookie-parser');
var session = require('express-session');

//HELPERS
const dbConfig = require('./knexfile');
const db_helpers = require('./db_helpers');
const db = knex(dbConfig.development);

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

server.use(cookieParser());
server.use(session({
    secret: "It's top secret!",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
}));

//SERVER & PAGE VIEWS CONFIRMATION
server.get('/', (req, res) => {
    if(req.session.page_views){
        req.session.page_views++;
        res.send("Welcome to my Cascade Financial Tech Assessment. You've been here " + req.session.page_views + " times");
     } else {
        req.session.page_views = 1;
        res.send("Welcome to my Cascade Financial Tech Assessment for the first time!");
     }
});

//RETRIEVE ALL USERS
server.get('/users', (req, res) => {
    console.log('Retrieving user list')
    db_helpers.getUsers()
        .then(userInfo => {
            res.send(userInfo)
        })
        .catch(err => {
            res.status(500).send(err);
    })
})

//USER REGISTRATION ENDPOINT
server.post('/register', async (req, res) => {
    console.log('Creating new user')

//HASHING PASSWORD DATA
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    console.log(salt)
    console.log(hashedPassword)

        const user = {
            email: req.body.email,
            password: hashedPassword,
            phone_number: req.body.phone_number
        }

        db('users')
        .select()
        .where('email', req.body.email)
        .then(function(rows){
            if(rows.length === 0){
                console.log('No user Found')
                db('users').insert(user)
                .then(ids => {
                    res.status(201).json(ids);
                })
            } else if(rows.length > 0){
                console.log('Cant add new user')
            }
        })
})

//ALL FAILED LOGIN ATTEMPTS
server.get('/failed', (req,res) => {
    console.log('Retrieving failed attempts')
    return db('events')
    .then(eventsInfo => {
        res.send(eventsInfo)
    })
    .catch(err => {
        res.status(500).send(err);
})
})

// LOGIN EVENTS BY SINGLE USER
// EX SEARCH QUERY http://localhost:7000/failed/June_27_2020
server.get('/failed/:created', (req, res) => {
    console.log('Retrieving user by failed login date')
    const { created } = req.params;
    db('events').where('created', created)
        .then(rows => {
            res.json(rows);
        }).catch(err => {
        res.status(500).json({err: 'No failed attempts to display'})
    })
})

//EX SEARCH QUERY http://localhost:7000/login/test2@test.com
server.get('/login/:email', (req, res) => {
    console.log('Retrieving user login attempts')
    const { email } = req.params;
    db('events').where('email', email)
        .then(rows => {
            res.json(rows);
        }).catch(err => {
        res.status(500).json({err: 'No failed attempts to display for user'})
    })
})

//CHECKS FOR USER - IF NONE FOUND, WRITES FAILED LOGIN ATTEMPT TO EVENTS DATABASE
server.get('/login', (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password,
        phone_number: req.body.phone_number
    }
    console.log(req.body)
    db('users')
    .select()
    .where('password', req.body.password)
    .then(function(rows){
        if(rows.length === 0){
            console.log('No user Found for', user.email)
            console.log(moment().format("MMMM_DD_YYYY"))
            const event = {
                email: req.body.email,
                created: moment().format("MMMM_DD_YYYY"),
                type: 'Login'
            }
    db('events').insert(event)
    .then(ids => {
        res.status(201).json(ids);
    })
        } else {
            console.log('User Found')
            res.send('User found')
        }
    })
})

server.listen(PORT, () => console.log(`server running on port ${PORT}`));