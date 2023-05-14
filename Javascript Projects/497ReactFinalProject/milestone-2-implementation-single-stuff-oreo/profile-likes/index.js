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
  if (await db.listCollections({ name: 'profilelikes' }).hasNext()) {
    console.log('Collection already exists. Skipping initialization.');
    return;
  }
  const profilelikes = db.collection('profilelikes');
  console.log(`Initialized:`);
}

//////////////////////////////////////
async function start() {
  const mongo = await connectDB();
  await initDB(mongo);

  app.post('/profilelikes', async (req, res) => {
    const { author, username } = req.body;
    if (author === undefined) {
      res.status(400).send({ message : "Request Data AUTHOR Is Incomplete"});
    }
    if (username === undefined) {
      res.status(400).send({ message : "Request Data USERNAME Is Incomplete"});
    }
    const profilelikesDB = mongo.db().collection('profilelikes');
    const result = profilelikesDB.findOne({author: author});
    const profilelikes = result.profilelikes;
    profilelikes.push(username)
    profilelikesDB.findOneAndUpdate({author: author}, {profilelikes: profilelikes});

    await axios.post('http://eventbus:4005/events', {
    // await axios.post('http://localhost:4005/events', {
      type: 'ProfileLiked',
      data: {
        author,
        username,
      },
    });

    res.send({ status: 'OK' });

  });

  app.post("/events", async (req, res) => {
    const { type, data } = req.body;
    console.log(type);
    if (type === 'AccountCreated') {
      const profilelikesDB = mongo.db().collection('profilelikes');
      await profilelikesDB.insertOne({author: data.username, profilelikes: []});
    }
    res.send({});
  });

  app.listen(4008, () => {
    console.log("Listening on 4008");
  });
}

start();