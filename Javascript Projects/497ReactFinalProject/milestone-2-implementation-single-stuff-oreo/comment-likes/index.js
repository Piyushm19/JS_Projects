import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import axios from 'axios';
import { MongoClient } from 'mongodb';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());


async function connectDB() {
  const uri = process.env.DATABASE_URL;
  if (uri === undefined) {
    throw Error('DATABASE_URL environment variable is not specified');
  }
  const mongo = new MongoClient(uri);
  await mongo.connect();
  return await Promise.resolve(mongo);
}

async function initDB(mongo) {
  const db = mongo.db();
  if (await db.listCollections({ name: 'commentlikes' }).hasNext()) {
    console.log('Collection already exists. Skipping initialization.');
    return;
  }
  const commentlikes = db.collection('commentlikes');
  console.log(`Initialized:`);
}

async function getCommentLikes(mongo, commId) {
  const commentlikesDB = mongo.db().collection('commentlikes');
  const result = commentlikesDB.findOne({commId});
  return result.commentlikes;
}

async function start() {
  const mongo = await connectDB();
  await initDB(mongo);

  app.get('/comments/:commId/commentlikes', async (req, res) => {
    const commentlikes = getCommentLikes(mongo, req.params.commId);
    res.status(200).send(commentlikes);
  });

  app.post('/commentlikes', async (req, res) => {

    const { username, commId, postId } = req.body;
    if (commId === undefined) {
      res.status(400).send({ message : "Request Data ID Is Incomplete"});
    }
    if (postId === undefined) {
      res.status(400).send({ message : "Request Data POSTID Is Incomplete"});
    }
    if (username === undefined) {
      res.status(400).send({ message : "Request Data USERNAME Is Incomplete"});
    }

    const commentlikesDB = mongo.db().collection('commentlikes');
    const result = commentlikesDB.findOne({commId});
    const commentlikes = result.commentlikes;
    if(commentlikes.includes(username)) {
      const newCommLikes = [];
      commentlikes.forEach(u => {
        if (u != username) {
          newCommLikes.push(u);
        }
      });
      commentlikesDB.findOneAndUpdate({commId}, {commentlikes: newCommLikes});
    }
    else {
      commentlikes.push(username);
      commentlikesDB.findOneAndUpdate({commId}, {commentlikes: commentlikes});
    }

    //Emitting a commentVoted Event to the Event-bus, which will alert query to update the vote count for its own database
    await axios.post('http://eventbus:4005/events', {
      type: 'CommentLiked',
      data: {
        username,
        commId,
        postId,
      },
    });

    res.send({ status: 'OK' });

  });
  
  app.post("/events", async (req, res) => {
    const { type, data } = req.body;

    console.log(type);

    if (type === 'CommentCreated') {
      const { username, commId, content, postId } = data;
      const commentlikesDB = mongo.db().collection('commentlikes');
      await commentlikesDB.insertOne({ commId, postId, commentlikes: [],});
    }

    res.send({});
  });

  app.listen(4007, () => {
    console.log("Listening on 4007");
  });
}

start();