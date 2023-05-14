import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import axios from 'axios';
import { MongoClient } from 'mongodb';
import { randomBytes } from "crypto";

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

// //Terms are ensured to be lowercase
const notAllowedterms = ["Sam", "sAmmy", "saMantha"];
// //Make all not allowed terms lowercase
const notAllowed = notAllowedterms.map(t => t = t.toLowerCase());

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
    if (await db.listCollections({ name: 'moderator' }).hasNext()) {
      console.log('Collection already exists. Skipping initialization.');
      return;
    }
    const moderatorDB = db.collection('moderator');
    console.log(`Initialized:`);
  }
  //////////////////////////////////////////////
  
//   async function getAccounts(mongo) {
//     const accountsDB = mongo.db().collection('accounts');
//     const result = accountsDB.find();
  
//     const ret = [];
  
//     await result.forEach((doc) => {
//       ret.push({
//         _id: doc._id.toHexString(),
//         username: doc.username,
//         password: doc.password,
//       });
//     });
  
//     return ret;
//   }
  
  //////////////////////////////////////
  async function start() {
    const mongo = await connectDB();
    await initDB(mongo);

    app.post("/comments/:postId/moderator", async (req, res) => {
        const moderatorDB = mongo.db().collection('moderator');
        const commId = randomBytes(4).toString("hex");
        const { username, content } = req.body;
        const postId = req.params.postId;
        let valid = true;
        const words = content.split(" ");

        //check to see if any disallowed terms are in the comment
        for(const term of words) {
            //In this implementation the term has to be exact to get rejected, case is accounted for (insensitive)
            if(notAllowed.indexOf((term.toLowerCase())) != -1) {
                valid = false;
                break;
            }
        }

        if (valid) {
            const comment = {
                username,
                postId,
                commId, 
                content,
                status: "ACCEPTED",
                commentLikes:[],
            }
        
            await moderatorDB.insertOne(comment);
        
            await axios.post("http://eventbus:4005/events", {
                type: "CommentModerated",
                data: comment,
            });

            res.status(201).send(comment);

        }
        else {
            const comment = {
                username,
                postId,
                commId, 
                content,
                status: "Rejected",
            }
            await moderatorDB.insertOne(comment);
            res.status(201).send(comment);
        }
      });
    
    app.post("/events", (req, res) => {
        console.log(req.body.type);
        res.send({ status: 'OK' });
    });
  
    app.listen(4003, () => {
      console.log("Listening on 4003");
    });
  }
  
  start();