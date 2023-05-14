import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import axios from 'axios';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

const wordList = ["one", "two", "three"];

app.post('/events', (req, res) => {
  const { type, data } = req.body;

  if (type === "CommentCreated") {
    const { id, content, postId } = data;
    let breakStatus = false;
    const comments = content.split(" ");

    for(const word of wordList) {
      for (const comment of comments) {
        if (word.toLowerCase() === comment.toLowerCase()) {
          axios.post('http://localhost:4002/events', {
                type: 'CommentModerated',
                data: {
                    id,
                    content,
                    postId,
                    status: "(rejected)",
          }}); 
          breakStatus = true;
          break;
        }
      }
      if (breakStatus) {break;}
    }
    if (!breakStatus) {
      axios.post('http://localhost:4002/events', {
                type: 'CommentModerated',
                data: {
                    id,
                    content,
                    postId,
                    status: "(accepted)",
      }});
    }
  }

  res.send({ status : 'OK' });

});

app.listen(4003, () => {
  console.log('Listening on 4003');
});
