const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const image = require('./controllers/image')

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'test',
        database: 'smart_brain'
    }
});

// db.select('*').from('users').then(data => {
//     console.log(data);
// });

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => { db.select('*').from('users').then(data => {res.json(data)}) })

app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt)})

app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})

app.get('/profile/:id', (req, res) => {profile.handleProfile(req, res, db)})

app.post('/image', (req, res) => {image.handleImage(req, res, db)})

app.put('/updateRank', (req, res) => {image.updateRank(req, res, db)})

app.listen(3000);

/* planning:
    / --> GET --> users
    /signin --> POST --> user (post because its better to send sensitive data over https in the body)
    /register --> POST --> user
    /profile/:userId --> GET --> user
    /updateRank --> PUT --> rank (update the rank)
 */