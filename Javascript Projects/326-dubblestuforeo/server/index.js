import express from 'express';
import logger from 'morgan';
import { GuzzzleDatabase } from './guzzzle-db.js';
import Session from "express-session";
import cookieParser from "cookie-parser";

class GuzzzleServer {
  constructor(dburl) {
    this.dburl = dburl;
    this.app = express();
    this.app.use(logger('dev'));
    this.app.use(express.static('./'));
    this.app.use(express.json({limit: "10 mb"}));
    //THIS NEEDS TO GO AFTER JSON (do not change)
    this.app.use(express.urlencoded({limit: "10mb", extended: true}));
    var sess = {
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {maxAge: 86400000}
    };
    this.app.use(cookieParser());
    this.app.use(Session(sess));
  }

  async initRoutes() {
    const self = this;

    this.app.get('/currentuser', async (request, response) => {
      try {
        response.status(200).json(await self.db.getUser(request.session.uid));
      }
      catch (err) {
        response.status(500).json({error: err});
      }
    });

    //LOGIN
    this.app.get('/login', async (request, response) => {
      try {
        const uid = request.query.uid;
        const password = request.query.password;
        const user = await self.db.getUser(uid);
        if (!user) {
          response.status(404).json({ error: `Username '${uid}' does not exist`});
        }
        else if (user.password != password) {
          response.status.json({error: `Password for '${uid}' is incorrect`});
        }
        else {
          request.session.uid = uid;
          response.status(200).json(user);
        }
      }
      catch (err) {
        response.status(500).json({error: err});
      }
    });

    //LOGOUT
    this.app.get('/logout', async (request, response) => {
      request.session.destroy();
      response.status(200).json({status: "Logout Success"});
    });

    //CREATE A USER
    this.app.post('/user_create', async (request, response) => {
      try {
        const body = request.body;
        const not_available = await self.db.getUser(body.uid);
        if (not_available) {
          response.status(400).json({error: `Username '${body.uid}' is already taken`});
        }
        else {
          const new_user = await self.db.createUser(
            body.uid,
            body.email,
            body.password,
            body.pfp
          );
          request.session.uid = body.uid;
          response.status(200).json(new_user);
        }
      }
      catch (err) {
        response.status(500).json({error: err});
      }
    });

    //GET A USER
    this.app.get('/user', async (request, response) => {
      try {
        const uid = request.query.uid;
        const user = await self.db.getUser(uid);
        if (!user) {
          response.status(404).json({ error: `Username '${uid}' does not exist`});
        }
        else {
          response.status(200).json(user);
        }
      }
      catch (err) {
        response.status(500).json({error: err});
      }
    });

    //UPDATE A USER
    this.app.put('/user_update', async (request, response) => {
      try {
        const uid = request.session.uid;
        const password = request.body.password;
        const check = await self.db.getUser(uid);
        if (check === null || check.password != password) {
          response.status(400).json({error: "Password Incorrect"});
        }
        else {
          const body = request.body;
          const result = await self.db.updateUser(uid, body.newPassword, body.biography, body.profileImage);
          if (!result) {
            response.status(400).json({ error: `Error updating account`});
          }
          else {
            response.status(200).json(result);
          }
        }
      }
      catch (err) {
        response.status(500).json({error: err});
      }
    });

    //DELETE A USER
    this.app.delete('/user_delete', async (request, response) => {
      try {
        const uid = request.session.uid;
        const password = request.query.password;
        const check = await self.db.getUser(uid);
        if (check === null || check.password != password) {
          response.status(400).json({error: "Password Incorrect"});
        }
        else {
          const result = await self.db.deleteUser(uid);
          if (!result) {
            response.status(400).json({ error: `Error deleting account`});
          }
          else {
            response.status(200).json({status: "success"});
          }
        }
      }
      catch (err) {
        response.status(500).json({error: err});
      }
    });

    //CREATE A POST
    this.app.post('/post_create', async (request, response) => {
      try {
        const uid = request.session.uid;
        const body = request.body;
        const not_available = await self.db.getUser(uid);
        if (!not_available) {
          response.status(400).json({error: `Must be logged in to post`});
        }
        else {
          const d = new Date();
          const date = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
          const result = await self.db.createPost(
            uid,
            body.title,
            body.image, 
            date, 
            body.ingredient_keys, 
            body.ingredients, 
            body.instructions, 
            body.description
          );
          response.status(200).json(result);
        }
      }
      catch (err) {
        response.status(500).json({error: err});
      }
    });

    //GET A POST
    this.app.get('/post', async (request, response) => {
      try {
        const pid = parseInt(request.query.pid);
        const post = await self.db.getPost(pid);
        if (!post) {
          response.status(404).json({ error: `Post '${pid}' does not exist`});
        }
        else {
          response.status(200).json(post);
        }
      }
      catch (err) {
        response.status(500).json({error: err});
      }
    });

    //GET A USERS OTHER POSTS
    this.app.get('/otherposts', async (request, response) => {
      try {
        const query = request.query;
        const pid = parseInt(query.pid);
        const PIDs = await self.db.getOtherPosts(pid);
        response.status(200).json(PIDs);
      }
      catch(err) {
        response.status(500).json({error: err});
      }
    }); 

    //UPDATE A POST
    this.app.put('/post_update', async (request, response) => {
      try {
        const pid = request.body.pid;
        const body = request.body;
        const post = await self.db.getPost(pid);
        if (post.uid != request.session.uid) {
          response.status(400).json({error: "You must own this post to update."})
        }
        else {
          const result = await self.db.updatePost(
            pid,
            body.title,
            body.image,
            body.ingredient_keys,
            body.ingredients,
            body.instructions,
            body.description
          );
          if (!result) {
            response.status(400).json({ error: `Error updating post`});
          }
          else {
            response.status(200).json(result);
          }
        }
      }
      catch (err) {
        response.status(500).json({error: err});
      }
    });

    //DELETE A POST
    this.app.delete('/post_delete', async (request, response) => {
      try {
        const pid = parseInt(request.query.pid);
        const post = await self.db.getPost(pid);
        if (post.uid != request.session.uid) {
          response.status(400).json({error: "You must own the post to delete it."});
        }
        else {
          const result = await self.db.deletePost(pid);
          if (!result) {
            response.status(400).json({ error: `Error deleting post`});
          }
          else {
            response.status(200).json({status: "success"});
          }
        }
      }
      catch (err) {
        response.status(500).json({error: err});
      }
    });

    //QUERY THE INDEX
    this.app.get('/query', async (request, response) => {
      try {
        let keys = request.query.query;
        keys = keys.split(" ");
        keys = keys.map(key => key.replace("_", " "));
        const result = await self.db.query(keys);
        if (result === []) {
          response.status(404).json({ error: `No matching posts`});
        }
        else {
          response.status(200).json(result);
        }
      }
      catch (err) {
        response.status(500).json({error: err});
      }
    });


    //GET THE FEED
    this.app.get('/feed', async (request, response) => {
      try {
        const uid = request.session.uid;
        const user = await self.db.getUser(uid);
        if (!uid || !user) {
          const defaultFeed = await self.db.defaultFeed();
          response.status(200).json(defaultFeed);
        }
        else {
          const posts = await self.db.feed(uid);
          response.status(200).json(posts);
        }
      }
      catch (err) {
        response.status(500).json({error: err});
      }
    });   

    //FOR USE IN LIKE AND UNLIKE REQUESTS
    async function votePost(response, uid, pid, like) {
      try {
        const not_available = await self.db.getUser(uid);
        if (!not_available) {
          response.status(400).json({error: `Must be logged in to like/unlike`});
        } else {
          if(like) {
            let post = await self.db.likePost(uid, pid);
            response.status(200).json(post)
          } else {
            let post = await self.db.unlikePost(uid, pid);
            response.status(200).json(post)
          }
        }
      }
      catch(err) {
        response.status(500).json({error: err});
      }
    }

    //LIKE A POST
    this.app.put('/like', async (request, response) => {
        const query = request.query;
        votePost(response, request.session.uid, parseInt(query.pid), true);
    });

    //UNLIKE A POST
    this.app.put('/unlike', async (request, response) => {
      const query = request.query;
      votePost(response, request.session.uid, parseInt(query.pid), false);
    });

    // //FOR USE IS FOLLOW/UNFOLLOW USER
    async function manageFollow(response, uid_to, uid_from, follow) {
      try {
        if(follow) {
          let user = await self.db.follow(uid_to, uid_from);
          response.status(200).json(user)
        } else {
          let user = await self.db.unfollow(uid_to, uid_from);
          response.status(200).json(user)
        }
      }
      catch(err) {
        response.status(500).json({error: err});
      }
    }

    // //FOLLOW A USER
    this.app.put('/follow', async (request, response) => {
      const query = request.query;
      manageFollow(response, query.uid_to, query.uid_from, true);
    });

    // //UNFOLLOW A USER
    this.app.put('/unfollow', async (request, response) => {
      const query = request.query;
      manageFollow(response, query.uid_to, query.uid_from, false);
    });

    //COMMENT ON A POST
    this.app.put('/comment', async (request, response) => {
      try {
        const query = request.query;
        const uid = request.session.uid;
        const pid = parseInt(query.pid);
        const comment = query.comment;
        const not_available = await self.db.getUser(uid);
        if (!not_available) {
          response.status(400).json({error: `Must be logged in to comment`});
        }
        const cid = await self.db.createComment(uid, pid, comment);
        response.status(200).json(cid);
      }
      catch(err) {
        response.status(500).json({error: err});
      }
    });

    //GET COMMENTS OF A POST
    this.app.get('/comments_get', async (request, response) => {
      try {
        const query = request.query;
        const pid = parseInt(query.pid)
        const comments = await self.db.getComments(pid);
        response.status(200).json(comments);
      }
      catch(err) {
        response.status(500).json({error: err});
      }
    });

    // GET A COMMENT
    this.app.get('/comment_get', async (request, response) => {
      try {
        const query = request.query;
        const pid = parseInt(query.pid);
        const cid = parseInt(query.cid);
        const comment = await self.db.getComment(pid, cid);
        response.status(200).json(comment);
      }
      catch(err) {
        response.status(500).json({error: err});
      }
    });

    //DELETE A COMMENT OF A POST
    this.app.delete('/comment_delete', async (request, response) => {
      try {
        const query = request.query;
        const cid = parseInt(query.cid);
        const pid = parseInt(query.pid);
        const result = await self.db.deleteComment(pid, cid);
        response.status(200).json({status: "success"});
      }
      catch(err) {
        response.status(500).json({error: err});
      }
    });

    //GET WHETHER USER HAS LIKED COMMENT
    this.app.get('/comment_check', async (request, response) => {
      try {
        const query = request.query;
        const uid = request.session.uid;
        const pid = parseInt(query.pid);
        const cid = parseInt(query.cid);
        const obj = await self.db.commentLiked(uid, pid, cid)
        response.status(200).json(obj);
      }
      catch(err) {
        response.status(500).json({error: err});
      }
    });

    //LIKE A COMMENT
    this.app.put('/comment_like', async (request, response) => {
      try {
        const query = request.query;
        const uid = request.session.uid;
        const pid = parseInt(query.pid);
        const cid = parseInt(query.cid);
        const result = await self.db.likeComment(uid, pid, cid)
        response.status(200).json({status: "success"});
      }
      catch(err) {
        response.status(500).json({error: err});
      }
    });

    //UNLIKE A COMMENT
    this.app.put('/comment_unlike', async (request, response) => {
      try {
        const query = request.query;
        const uid = request.session.uid;
        const pid = parseInt(query.pid);
        const cid = parseInt(query.cid);
        const result = await self.db.unlikeComment(uid, pid, cid)
        response.status(200).json({status: "success"});
      }
      catch(err) {
        response.status(500).json({error: err});
      }
    });

    //OTHER
  this.app.get('*', async (request, response) => {
      response.status(404).send(`Not found: ${request.path}`);
    });
  }

  async initDb() {
    this.db = new GuzzzleDatabase(this.dburl);
    await this.db.connect();
  }

  async start() {
    await this.initRoutes();
    await this.initDb();
    const port = process.env.PORT || 8080;
    this.app.listen(port, () => {
      console.log(`GuzzzleServer listening on port ${port}!`);
    });
  }
}

const server = new GuzzzleServer(process.env.DATABASE_URI);
server.start();