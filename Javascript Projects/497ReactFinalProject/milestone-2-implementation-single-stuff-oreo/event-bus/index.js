import express from 'express';
import logger from 'morgan';
import axios from 'axios';

const app = express();

app.use(logger('dev'));
app.use(express.json());

app.post('/events', (req, res) => {
  const event = req.body;

  axios.post('http://posts:4000/events', event).catch((err) => {
    console.log(err.message);
  });

  axios.post('http://comments:4001/events', event).catch((err) => {
    console.log(err.message);
  });

  axios.post('http://query:4002/events', event).catch((err) => {
    console.log(err.message);
  });

  axios.post('http://moderator:4003/events', event).catch((err) => {
    console.log(err.message);
  });

  axios.post('http://accounts:4004/events', event).catch((err) => {
    console.log(err.message);
  });

  axios.post('http://postlikes:4006/events', event).catch((err) => {
    console.log(err.message);
  });

  axios.post('http://commentlikes:4007/events', event).catch((err) => {
    console.log(err.message);
  });

  axios.post('http://profilelikes:4008/events', event).catch((err) => {
    console.log(err.message);
  });

  axios.post('http://favorites:4009/events', event).catch((err) => {
    console.log(err.message);
  });

  // axios.post('http://localhost:4000/events', event).catch((err) => {
  //   console.log(err.message);
  // });

  // axios.post('http://localhost:4001/events', event).catch((err) => {
  //   console.log(err.message);
  // });

  // axios.post('http://localhost:4002/events', event).catch((err) => {
  //   console.log(err.message);
  // });

  // axios.post('http://localhost:4003/events', event).catch((err) => {
  //   console.log(err.message);
  // });

  // axios.post('http://localhost:4004/events', event).catch((err) => {
  //   console.log(err.message);
  // });

  // axios.post('http://localhost:4006/events', event).catch((err) => {
  //   console.log(err.message);
  // });

  // axios.post('http://localhost:4007/events', event).catch((err) => {
  //   console.log(err.message);
  // });

  // axios.post('http://localhost:4008/events', event).catch((err) => {
  //   console.log(err.message);
  // });

  // axios.post('http://localhost:4009/events', event).catch((err) => {
  //   console.log(err.message);
  // });

  res.status(200).send({});
});

app.listen(4005, () => {
  console.log('Listening on 4005');
});
