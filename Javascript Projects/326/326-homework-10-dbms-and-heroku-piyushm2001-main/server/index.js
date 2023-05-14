import express from 'express';
import { playerDatabase } from './scrabble-db.js';
import logger from 'morgan';

class scrabbleServer {
  constructor(dburl) {
    this.dburl = dburl;
    this.app = express();
    this.app.use(logger('dev'));
    this.app.use('/', express.static('client'));
  }

  async initRoutes() {
    // Note: when using arrow functions, the "this" binding is lost.
    const self = this;

    this.app.post('/wordScore', async (req, res) => {
      try {
        const { name, word, score } = req.query;
        const person = await self.db.createWordScore(name, word, score);
        res.status(200).send(JSON.stringify(person));
      } catch (err) {
        res.status(500).send(err);
      }
    });

    this.app.post('/gameScore', async (req, res) => {
      try {
        const { name, score } = req.query;
        const person = await self.db.createGameScore(name, score);
        res.status(200).send(JSON.stringify(person));
      } catch (err) {
        res.status(500).send(err);
      }
    });

    this.app.get('/highestWordScores', async (req, res) => {
      try {
        const scores = await self.db.readAllScores();
        const sorted = scores.sort((a, b) => b.score - a.score);
        const top = sorted.slice(0, 10);
        res.status(200).send(top);
      } catch (err) {
        res.status(500).send(err);
      }
    });

    this.app.get('/highestGameScores', async (req, res) => {
      try {
        const scores = await self.db.readAllGameScores();
        const sorted = scores.sort((a, b) => b.score - a.score);
        const top = sorted.slice(0, 10);
        res.status(200).send(top);
      } catch (err) {
        res.status(500).send(err);
      }
    });

  }

  async initDb() {
    this.db = new playerDatabase(this.dburl);
    await this.db.connect();
  }

  async start() {
    await this.initRoutes();
    await this.initDb();
    const port = process.env.PORT || 8080;
    this.app.listen(port, () => {
      console.log(`PeopleServer listening on port ${port}!`);
    });
  }
}
                                                                                                                                  
const server = new scrabbleServer(process.env.DATABASEURL);
server.start();
