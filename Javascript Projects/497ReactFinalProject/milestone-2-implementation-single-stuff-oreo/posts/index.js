import express from "express";
import logger from "morgan";
import { randomBytes } from "crypto";
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
  if (await db.listCollections({ name: 'posts' }).hasNext()) {
    console.log('Collection Posts already exists. Skipping initialization.');
    return;
  }
  const posts = db.collection('posts');
  console.log(`Initialized: posts`);
}

async function getPosts(mongo) {
  const posts = mongo.db().collection('posts');
  const result = posts.find();

  const ret = [];

  await result.forEach((doc) => {
    ret.push({
      username: doc.username,
      postId: doc.postId,
      title: doc.title,
      desc: doc.desc,
      inst: doc.inst,
      postLikes: doc.postLikes,
      comments: doc.comments,
    });
  });

  return ret;
}

async function start() {
  const mongo = await connectDB();
  await initDB(mongo);

  //get all posts
  app.get("/posts", async (req, res) => {
    const posts = await getPosts(mongo);
    res.status(200).send(posts);
  });
  
  //create post
  app.post("/posts", async (req, res) => {
    const postId = randomBytes(4).toString("hex");
    const { username, title, desc, inst } = req.body;
  
    const newPost = {
      username,
      postId,
      title,
      desc,
      inst,
      postLikes : [],
      comments : [],
    };

    const postsDB = mongo.db().collection('posts');
    await postsDB.insertOne(newPost);
  
    await axios.post("http://eventbus:4005/events", {
      type: "PostCreated",
      data: newPost,
    });
  
    res.status(201).send(newPost);
  });

  //event handler
  app.post("/events", async (req, res) => {
    console.log(req.body.type);
    if(req.body.type === "CommentCreated") {
      const comment = req.body.data;
      const postsDB = mongo.db().collection('posts');
      const postId = comment.postId;
      const post = await postsDB.findOne({postId: postId});
      const comments = post.comments;
      comments.push(comment);
      await postsDB.updateOne(
        {
          postId: comment.postId
        },
        {
            $set: {
                "comments": comments
            }
        }
      );
    }

    if(req.body.type === "PostLiked") {
      const postlike = req.body.data;
      const postsDB = mongo.db().collection('posts');
      const postId = postlike.postId;
      const post = await postsDB.findOne({postId: postId});
      const postlikes = post.postlikes;
      postlikes.push(postlike.username);
      await postsDB.updateOne(
        {
          postId: postId
        },
        {
            $set: {
                "postlikes": postlikes
            }
        }
      );
    }

    if(req.body.type === "CommentLiked") {
      const commentlike = req.body.data;
      const postsDB = mongo.db().collection('posts');
      const postId = commentlike.postId;
      const post = await postsDB.findOne({postId: postId});
      const comments = post.comments;
      comments.forEach(doc => {
        if (doc.commId ===  commentlike.commId) {
          doc.commentlikes.push(commentlike.username)
        }
      });
      await postsDB.updateOne(
        {
          postId: postId
        },
        {
            $set: {
                "comments": comments
            }
        }
      );
    }

    res.send({});
  });

  app.listen(4000, () => {
    console.log("Listening on 4000");
  });
}

start();