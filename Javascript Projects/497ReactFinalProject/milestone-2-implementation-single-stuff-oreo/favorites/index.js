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
  if (await db.listCollections({ name: 'favorites' }).hasNext()) {
    console.log('Collection Favorites already exists. Skipping initialization.');
    return;
  }
  const posts = db.collection('favorites');
  console.log(`Initialized: favorites`);
}

  async function start() {
    const mongo = await connectDB();
    await initDB(mongo);
    const favDB = mongo.db().collection('favorites');

    //add favorites
    app.post("/fav", async (req, res) => {
      const { username, postId } = req.body;
      const favs = await favDB.findOne( {username: username} );
      console.log(postId);
      favs.favorites.push(postId);
      await favDB.updateOne(
        {
          username: username
        },
        {
            $set: {
                "favorites": favs
            }
        }
      );
      await axios.post("http://eventbus:4005/events", {
        type: "Favorited",
        data: {
          username,
          postId
        },
      });
    
      res.send({});
    });
  
    //event handler
    app.post("/events", async (req, res) => {
      const event = req.body.type;
      console.log(event);
      if(event === 'AccountCreated') {
        const data = req.body.data;
        const fav = {
          username: data.username,
          favorites: [],
        }
        await favDB.insertOne(fav);
      }
      res.send({});
    });
  
    app.listen(4009, () => {
      console.log("Listening on 4009");
    });
  }
  
  start();