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

async function initDB(mongo) {
  const db = mongo.db();
  if (await db.listCollections({ name: 'comments' }).hasNext()) {
    console.log('Collection Posts already exists. Skipping initialization.');
    return;
  }
  const comments = db.collection('comments');
  console.log(`Initialized: comments`);
}

async function start() {
  const mongo = await connectDB();
  await initDB(mongo);
  const commentsDB = mongo.db().collection('comments');

  //event handler
  app.post("/events", async (req, res) => {
    const event = req.body.type;
    console.log(event);
    if(event === "CommentModerated") {
      const comment = req.body.data;
      const commentsDB = mongo.db().collection('comments');
      commentsDB.insertOne(comment);

      await axios.post("http://eventbus:4005/events", {
        type: "CommentCreated",
        data: comment,
      });
    }
    if(event === "CommentLiked") {
      const commentlike = req.body.data;
      const commentsDB = mongo.db().collection('comments');
      const commId = commentlike.commId;
      const comment = commentsDB.findOne({commId});
      const commentlikes = comment.commentlikes;
      commentlikes.push(commentlike.username);
      commentsDB.findOneAndUpdate({commId}, {commentlikes});
    }

    res.send({});
  });
  
  app.listen(4001, () => {
    console.log("Listening on 4001");
  });

}

start();