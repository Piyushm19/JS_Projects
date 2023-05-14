import express from "express";
import logger from "morgan";
import cors from "cors";
import axios from "axios";
import { MongoClient } from 'mongodb';

const app = express();

app.use(logger("dev"));
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
////////////////////////////////////////
async function initDB(mongo) {
  const db = mongo.db();
  if (await db.listCollections({ name: 'postlikes' }).hasNext()) {
    console.log('Collection already exists. Skipping initialization.');
    return;
  }
  const postlikesDB = db.collection('postlikes');
  console.log(`Initialized:`);
}

//////////////////////////////////////
async function start() {
  const mongo = await connectDB();
  await initDB(mongo);

  app.post('/postlikes', async (req, res) => {
    const { postId, author, username } = req.body;
    if (postId === undefined) {
      res.status(400).send({ message : "Request Data POSTID Is Incomplete"});
    }
    if (username === undefined) {
      res.status(400).send({ message : "Request Data USERNAME Is Incomplete"});
    }
    const postlikesDB = mongo.db().collection('postlikes');
    const result = postlikesDB.findOne({postId: postId});
    const postlikes = result.postlikes;
    postlikes.push(username)
    postlikesDB.findOneAndUpdate({postId: postId}, {postlikes: postlikes});

    await axios.post('http://eventbus:4005/events', {
    // await axios.post('http://localhost:4005/events', {
      type: 'PostLiked',
      data: {
        postId,
        author,
        username,
      },
    });

    res.send({ status: 'OK' });

  });

  app.post("/events", async (req, res) => {
    const { type, data } = req.body;
    console.log(type);
    if (type === 'PostCreated') {
      const postlikesDB = mongo.db().collection('postlikes');
      await postlikesDB.insertOne({postId: data.postId, postlikes: []});
    }
    res.send({});
  });

  app.listen(4006, () => {
    console.log("Listening on 4006");
  });
}

start();