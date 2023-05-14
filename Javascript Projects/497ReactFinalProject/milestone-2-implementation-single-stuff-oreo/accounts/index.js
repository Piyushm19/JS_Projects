import express from "express";
import logger from "morgan";
import cors from "cors";
import axios from "axios";
import { MongoClient } from 'mongodb';

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(cors());

// const accounts = {};

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
  if (await db.listCollections({ name: 'accounts' }).hasNext()) {
    console.log('Collection already exists. Skipping initialization.');
    return;
  }
  const accounts = db.collection('accounts');
  console.log(`Initialized:`);
}
//////////////////////////////////////////////

async function getAccounts(mongo) {
  const accountsDB = mongo.db().collection('accounts');
  const result = accountsDB.find();

  const ret = [];

  await result.forEach((doc) => {
    ret.push({
      _id: doc._id.toHexString(),
      username: doc.username,
      password: doc.password,
    });
  });

  return ret;
}

//////////////////////////////////////
async function start() {
  const mongo = await connectDB();
  await initDB(mongo);

  app.get("/accounts", async (req, res) => {
    const accounts = await getAccounts(mongo);
    res.status(200).send(accounts);
  });

  app.post("/accounts", async (req, res) => {
    const { username, password } = req.body;
    const accountsDB = mongo.db().collection('accounts');
    await accountsDB.insertOne({ username: username, password: password });

    await axios.post("http://eventbus:4005/events", {
        type: "AccountCreated",
        data: {
          username,
          password,
        },
      });
  
      res.status(200).send({})

  });
  
  app.post("/events", (req, res) => {
    console.log(req.body.type);
    res.send({});
  });

  app.listen(4004, () => {
    console.log("Listening on 4004");
  });
}

start();