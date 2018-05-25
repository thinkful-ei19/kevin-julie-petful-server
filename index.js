'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Queue = require('./queue');
const peek  = require('./peek');

const { PORT, CLIENT_ORIGIN } = require('./config');
// const { dbConnect } = require('./db-mongoose');
// const {dbConnect} = require('./db-knex');

const app = express();

function populateQueue(queue, data) {
  data = [...data];

  for (let i = 0; i < data.length; i++) {
    queue.enqueue(data[i]);
  }
}

const catQueue = new Queue();
const dogQueue = new Queue();

let cats = [{
    imageURL:'https://i.imgur.com/xeYCwti.png',   
    imageDescription: 'Hello Kitty',
    name: 'Fluffy',
    sex: 'Female',
    age: 2,
    breed: 'Cat',
    story: 'Thrown on the street'
  },
  {
    imageURL:'https://i.imgur.com/HzQWGWb.jpg',   
    imageDescription: 'Friendly Kitty',
    name: 'Calpico',
    sex: 'Female',
    age: 3,
    breed: 'Calico',
    story: 'Thrown on the street'
  },
  {
    imageURL:'https://i.imgur.com/aCNCr1Z.jpg',   
    imageDescription: 'Orange Kitty',
    name: 'Borange',
    sex: 'Male',
    age: 4,
    breed: 'Orange Tabby',
    story: 'Thrown on the street'
  },
  {
    imageURL:'https://i.imgur.com/hnRXL53.jpg',   
    imageDescription: 'Grey Kitty',
    name: 'Greyson',
    sex: 'Male',
    age: 4,
    breed: 'Grey Tabby',
    story: 'Thrown on the street'
  }]

let dogs = [{
    imageURL: 'https://i.imgur.com/qbRHEus.png',
    imageDescription: 'A sophisticated dog.',
    name: 'Sir Zeus',
    sex: 'Male',
    age: 3,
    breed: 'Chipoodle',
    story: 'Owner Passed away'
  },
  {
    imageURL: 'https://i.imgur.com/seS6JnE.png',
    imageDescription: 'Dog who likes to be found.',
    name: 'Waldo',
    sex: 'Male',
    age: 1,
    breed: 'Shihtzu',
    story: 'Owner Passed away'
  },
  {
    imageURL: 'https://i.imgur.com/6pYahQn.png',
    imageDescription: 'A magical unicorn dog',
    name: 'Sparkle',
    sex: 'Male',
    age: 3,
    breed: 'Chinicorn',
    story: 'Owner Passed away'
  },
  {
    imageURL: 'https://i.imgur.com/o46Orkk.png',
    imageDescription: 'A sea lovin dog',
    name: 'One-Eye Pegleg',
    sex: 'Male',
    age: 3,
    breed: 'Choodle',
    story: 'Owner Passed away'
  }

]

console.log(CLIENT_ORIGIN)
app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

app.get('/api/cat', (req, res) => {
  populateQueue(catQueue, cats);
  res.json(peek(catQueue));
})

app.delete('/api/cat', (req, res)=> {
  catQueue.dequeue();
  res.sendStatus(204);
})



app.get('/api/dog', (req, res) => {
  populateQueue(dogQueue, dogs);
  res.json(peek(dogQueue));
})

app.delete('/api/dog', (req, res)=> {
  dogQueue.dequeue();
  res.sendStatus(204);
})

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  // dbConnect();
  runServer();
}

module.exports = { app };
