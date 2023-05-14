import 'dotenv/config';
import { MongoClient, ServerApiVersion } from 'mongodb';

export class playerDatabase {
  constructor(dburl) {
    this.dburl = dburl;
  }

  async connect() {
    this.client = await MongoClient.connect(this.dburl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    });
    this.db = this.client.db('players');
  }

  async close() {
    this.client.close();
  }

  async createWordScore(name, word, score) {
    const res = await this.db.collection('wordScores').insertOne({ name, word, score });
    return res;
  }

  async createGameScore(name, score) {
    const res = await this.db.collection('gameScores').insertOne({ name, score });
    return res;
  }

  async readAllWordScores() {
    const res = await this.db.collection('wordScores').find({}).toArray();
    return res;
  }

  async readAllGameScores() {
    const res = await this.db.collection('gameScores').find({}).toArray();
    return res;
  }
}