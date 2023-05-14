import express, {Request, Response} from 'express';
import logger from 'morgan';
import cors from 'cors';
import axios from 'axios';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

const wordList: string[] = ["one", "two", "three"];
app.post('/events', (req : Request, res : Response) => {
  const type : string = req.body.type;
  const data = req.body.data;

  if (type === "CommentCreated") {
    const id : string = data.id;
    const content : string = data.content;
    const postId : string = data.postId;
    let breakStatus : boolean = false;
    const comments : string[] = content.split(" ");

    for(const word of wordList) {
      for (const comment of comments) {
        if (word.toLowerCase() === comment.toLowerCase()) {
          axios.post('http://query:4002/events', {
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
      axios.post('http://query:4002/events', {
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
