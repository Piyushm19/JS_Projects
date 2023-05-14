import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import axios from 'axios';

const app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(cors());

app.post('/vote', async (req, res) => {
    const { id, postId, vote } = req.body;

    await axios.post('http://localhost:4005/events', {
        type: 'CommentVoted',
        data: {
            id,
            postId,
            vote,
        },
    });

    res.send({ status : 'OK' });

});

app.post('/events', (req, res) => {
    console.log(req.body.type);
    res.send({});
});
  
app.listen(4004, () => {
    console.log('Listening on port 4004');
});