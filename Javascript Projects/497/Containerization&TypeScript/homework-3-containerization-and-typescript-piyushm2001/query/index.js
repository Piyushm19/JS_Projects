import express from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;

  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
    const { id, content, postId } = data;
    const post = posts[postId];
    const voteCount = 0;
    const status = "under_review";
    post.comments.push({ id, content, status, voteCount});
  }

  if (type === 'CommentModerated') {
    const post = posts[data.postId];
    for (const comment of post.comments) {
      if(data.id === comment.id) {
        comment.status = data.status;
      }
    }
  }

  if (type === 'CommentVoted') {
    const post = posts[data.postId];
    for (const comment of post.comments) {
      if(data.id === comment.id) {
        if(vote) {
          comment.voteCount++;
        }
        else {
          comment.voteCount--;
        }
      }
    }
  }

  console.log(posts);

  res.send({ status: 'OK' });
});

app.listen(4002, () => {
  console.log('Listening on 4002');
});
