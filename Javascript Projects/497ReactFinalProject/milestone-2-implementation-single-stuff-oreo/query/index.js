import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';

const app = express();

app.use(express.json());
app.use(cors());

const accounts = {};

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
  if (await db.listCollections({ name: 'query' }).hasNext()) {
    console.log('Collection already exists. Skipping initialization.');
    return;
  }
  console.log(`Initialized:`);
}
//////////////////////////////////////////////

async function getPost(mongo, username) {
  const queryDB = mongo.db().collection('query');
  const result = await queryDB.findOne({username : username});
  return result.posts;
}

async function getPosts(mongo) {
    const queryDB = mongo.db().collection('query');
    const result = await queryDB.find()
    const ret = [];

  await result.forEach((doc) => {
    doc.posts.forEach(d => {
      ret.push(d);
    });
  });

  return ret;
}

//////////////////////////////////////
async function start() {
  const mongo = await connectDB();
  await initDB(mongo);

  app.get('/posts/query', async (req, res) => {
    const posts = await getPosts(mongo);
    res.status(200).send(posts);
  });

  app.post('/events', async (req, res) => {
    const { type, data } = req.body;
  
    if (type === 'AccountCreated') {
      const { username, password } = data;
      const queryDB = mongo.db().collection('query');

      await queryDB.insertOne({ 
        username,
        password,
        favorites : [],
        profilelikes : [],
        posts: [],
      });
    }

  
    if (type === 'PostCreated') {
      //const { username, postId, title, desc, inst, postLikes, comments } = data;
      const posts = await getPost(mongo, data.username);
      const queryDB = mongo.db().collection('query');
      // console.log("QUERY2" + username);
      // console.log("QUERY3" + accounts);
      // console.log("QUERY4" + accounts[username]);
      // accounts[username].posts[id] = { username, postId, title, desc, inst, postLikes: [], comments: []};
      posts.push(data); 
      await queryDB.findOneAndUpdate({username : data.username}, {$set: { posts: posts }});
    }
    
    if (type === 'CommentCreated') {
      const posts = await getPost(mongo, data.username);
      const queryDB = mongo.db().collection('query');
      posts.forEach(doc => {
        if (doc.postId == data.postId) {
          doc.comments.push(data);
        }
      });
      await queryDB.findOneAndUpdate({username : data.username}, {$set: { posts: posts }});
    }

    if (type === 'Favorited') {
      const queryDB = mongo.db().collection('query');
      const account = await queryDB.findOne({username : data.username});
      const favorites = account.favorites;
      favorites.push(data.postId);
      await queryDB.findOneAndUpdate({username : data.username}, {$set: { favorites: favorites }});
    }

    if (type === 'ProfileLiked') {
      const queryDB = mongo.db().collection('query');
      const account = await queryDB.findOne({author : data.author});
      const profilelikes = account.profilelikes;
      profilelikes.push(data.username);
      await queryDB.findOneAndUpdate({author : data.author}, {$set: { profilelikes: profilelikes }});
    }

    if (type === 'PostLiked') {
      const queryDB = mongo.db().collection('query');
      const account = queryDB.findOne({username: data.author});
      const postlikes = account.postlikes;
      postlikes.push(data.username)
      postlikesDB.findOneAndUpdate({username: data.author}, {postlikes: postlikes});
    }
  
    
    //Handles commentLiked Events
    if (type === 'CommentLiked') {
      //value was determined in vote service
      const { username, commId, postId } = data;
      if (commId === undefined) {
        res.status(400).send({ message : "Request Data ID Is Incomplete"});
      }
      if (postId === undefined) {
        res.status(400).send({ message : "Request Data POSTID Is Incomplete"});
      }
      if (username === undefined) {
        res.status(400).send({ message : "Request Data POSTID Is Incomplete"});
      }
      const posts = await getPosts(mongo, username);
      const queryDB = mongo.db().collection('query');
      posts.forEach(doc => {
        if (doc.postId == postId) {
          doc.comments.forEach(d => {
            if(d.commId == commId) {
              d.commentlikes.push(username);
            }
          })
        }
      });
      await queryDB.findOneAndUpdate({username : data.username}, {$set: { posts: posts }});
    }
    
    res.send({ status: 'OK' });

  });

  app.listen(4002, () => {
    console.log("Listening on 4002");
  });
}

start();