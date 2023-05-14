import express from 'express';
import logger from 'morgan';
import { randomBytes } from 'crypto';
import { readFile, writeFile } from 'fs/promises';
// import Faker from faker;

// const faker = require('faker');

const app = express();

app.use(logger('dev'));
app.use(express.json());

let users = {};
let posts = {};
let comments = {};

const usersFile = 'users.json';
const postsFile = 'posts.json';
const commentsFile = 'comments.json';

async function reload() {
    try {
        const user = await readFile(usersFile, { encoding: 'utf8' });
        users = JSON.parse(user);
    }
    catch (err) {
        users = {};
    }
    try {
        const post = await readFile(postsFile, { encoding: 'utf8' });
        posts = JSON.parse(post);
    }
    catch (err) {
        posts = {};
    }
    try {
        const comment = await readFile(commentsFile, { encoding: 'utf8' });
        comments = JSON.parse(comment);
    }
    catch (err) {
        comments = {};
    }
}

async function saveUsers() {
    try {
        const user = JSON.stringify(users);
        await writeFile(usersFile, user, { encoding: 'utf8' });
    }
    catch (err) {
        console.log(err);
    }
    try {
        const post = JSON.stringify(posts);
        await writeFile(postsFile, post, { encoding: 'utf8' });
    }
    catch (err) {
        console.log(err);
    }
    try {
        const comment = JSON.stringify(comments);
        await writeFile(commentsFile, comment, { encoding: 'utf8' });
    }
    catch (err) {
        console.log(err);
    }
}


// for create user
app.post('/api/user/create', (req, res) => {
    reload();
    const userid = randomBytes(4).toString('hex');
    const { name } = req.body;
    (name === undefined) ? res.status(400).send({message : "Request data is incomplete"}) : 
    ((name.length > 64) ? res.status(500).send({message : "Name is over 64 characters"}) : console.log());
    
    users[userid] = { 
        userid,
        name
    };
    saveUsers();
    res.status(201).send(users[userid]);
});



// for create post
app.post('/api/posts/create', (req, res) => {
    reload();
    const postid = randomBytes(4).toString('hex');
    const { userid, content } = req.body;
  
    (userid === undefined && content === undefined) ? res.status(400).send({message : "Request data/content is Incomplete"}) :
    ((content.length > 128) ? res.status(500).send({message : "Content is over 128 characters"}) : console.log());

    const data = users[userid];

    ((data === undefined) ? res.status(404).send({message : "User does not exist"}) : console.log()); 

    const name = data.name;
    posts[postid] = {
      postid,
      content,
      name,
      userid
    }
    saveUsers();
    res.status(201).send(posts[postid]);
});



// for create comment
app.post('/api/comments/create', (req, res) => {
    reload();
    const commentid = randomBytes(4).toString('hex');
    const { userid, postid, content } = req.body;

    (userid === undefined && content === undefined && postid === undefined) ? 
    res.status(400).send({message : "Request data/content is Incomplete"}) : console.log();

    const user = users[userid];
    const post = posts[postid];
    ((user === undefined) || (post === undefined) ? res.status(404).send({message : "User or post does not exist"}) : console.log());
    
    const name = user.name;
    comments[commentid] = {
      postid,
      commentid,
      content,
      name,
      userid
    }
    saveUsers();
    res.status(201).send(comments[commentid]);
});



// for get comments
app.get('/api/comments/get', (req, res) => {
    reload();
    const { commentid } = req.body;
    (commentid === undefined) ? res.status(400).send({message : "Commentid request doesn't exist"}) : console.log();
    (comments[commentid] === undefined) ? res.status(404).send({message : "Comment does not exist"}) : console.log();
    saveUsers();
    res.status(200).send(comments[commentid]);
  });

app.listen(4000, () => {
    console.log('Listening on 4000');
});

// update name
app.put('/api/user/update', (req, res) => {
    reload();
    const { userid, name } = req.body;
    (userid === undefined) ? res.status(400).send({message : "Request data/content is Incomplete"}) : 
    ((name === undefined) ? res.status(400).send({message : "Request data is incomplete"}) : 
    ((name.length > 64) ? res.status(500).send({message : "Name is over 64 characters"}) : console.log()));

    users[userid]["name"] = name;
    saveUsers();
    res.status(200).send(users[userid]);
});
// update post
app.put('/api/posts/update', (req, res) => {
    reload();
    const { postid, content } = req.body;
    (postid === undefined) ? res.status(400).send({message : "Request data/content is Incomplete"}) : 
    ((content === undefined) ? res.status(400).send({message : "Request data is incomplete"}) : 
    ((content.length > 128) ? res.status(500).send({message : "Content is over 128 characters"}) : console.log()));

    posts[postid]["content"] = content;
    saveUsers();
    res.status(200).send(posts[postid]);
});
// update comment
app.put('/api/comments/update', (req, res) => {
    reload();
    const { commentid, content } = req.body;
    (commentid === undefined) ? res.status(400).send({message : "Request data/content is Incomplete"}) : 
    ((content === undefined) ? res.status(400).send({message : "Request data is incomplete"}) : 
    ((content.length > 128) ? res.status(500).send({message : "Content is over 128 characters"}) : console.log()));

    comments[commentid]["content"] = content;
    saveUsers();
    res.status(200).send(comments[commentid]);
});







//make a read and a write and pass in the data