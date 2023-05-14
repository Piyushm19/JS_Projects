import { MongoClient, ServerApiVersion } from 'mongodb';
import "dotenv/config";

export class GuzzzleDatabase {
    constructor(dburl) {
        this.dburl = dburl;
    }

    async connect() {
        this.client = await MongoClient.connect(this.dburl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverApi: ServerApiVersion.v1,
        });
        this.db = this.client.db('guzzzle');
    }

    async close() {
        this.client.close();
    }

    async getUser(uid) {
        this.collection = this.db.collection('users');
        const result = await this.collection.findOne(
            {
                uid: uid
            }
        );
        return result;
    }

    async createUser(uid, email, password, pfp) {
        this.collection = this.db.collection('users');
        await this.collection.insertOne(
            {
                uid: uid,
                email: email,
                password: password,
                profileImage: pfp, 
                biography: "", 
                posts: [], 
                following: [],
                followers: [], 
                likes: []
            }
        );
        return this.getUser(uid);
    }
    
    async updateUser(uid, newpassword, bio, pfp) {
        this.collection = this.db.collection('users');
        await this.collection.updateOne(
            {
                uid: uid
            },
            {
                $set: {
                    password: newpassword,
                    biography: bio,
                    profileImage: pfp
                }
            }
        );
        return await this.getUser(uid);
    }

    async deleteUser(uid) {
        this.collection = this.db.collection('users');
        const user = await this.getUser(uid);
        let following = user.following;
        let followers = user.followers;
        let posts = user.posts;
        for (const u of following) {
            await this.unfollow(uid, u);
        }
        for (const u of followers) {
            await this.unfollow(u, uid);
        }
        for (const p of posts) {
            await this.deletePost(p);
        }
        const result = await this.collection.deleteOne(
            {
                uid: uid
            }
        );
        return result.deletedCount === 1 ? true : false;
    }

    async getPost(pid) {
        this.collection = this.db.collection('posts');
        const result = await this.collection.findOne(
            {
                pid: pid
            }
        );
        return result;
    }

    async createPost(uid, title, image, date, ingredient_keys, ingredients, instructions, description) {
        this.collection = this.db.collection('posts');
        const result = await this.collection.find({}).toArray();
        let pid = -1;
        result.forEach(res => {
            pid = res.pid > pid ? res.pid : pid;
        });
        pid += 1;
        this.collection = this.db.collection('users');
        await this.collection.updateOne(
            {
                uid: uid
            },
            {
                $push: {
                    "posts": pid
                } 
            }
        );
        this.collection = this.db.collection('posts');
        await this.collection.insertOne(
            {
                pid: pid,
                uid: uid,
                title: title, 
                image: image, 
                date: date, 
                likes: 0, 
                ingredient_keys: ingredient_keys, 
                ingredients: ingredients, 
                instructions: instructions, 
                description : description, 
                comments: [], 
            }
        );
        return self.getPost(pid);
    }

    async getOtherPosts(pid) {
        let post = await this.getPost(pid);
        let user = await this.getUser(post.uid)
        let PIDs = [];
          //get rest of pids in PID list from each user
          user.posts.forEach(post => { 
            if (post != pid) {
              PIDs.push(post);
            }
          });
        return PIDs;
    }
    
    async updatePost(pid, title, image, ingredient_keys, ingredients, instructions, description) {
        this.collection = this.db.collection('posts');
        await this.collection.updateOne(
            {
                pid: pid
            },
            {
                $set: {
                    title: title,
                    image: image,
                    ingredient_keys: ingredient_keys,
                    ingredients: ingredients,
                    instructions: instructions,
                    description: description
                }
            }
        );
        return await this.getPost(pid);
    }

    async deletePost(pid) {
        const post = await this.getPost(pid);
        if (!post) return false;
        this.collection = this.db.collection('posts');
        const rmPost = await this.collection.deleteOne(
            {
                pid: pid
            }
        );
        this.collection = this.db.collection('users');
        const rmPID = await this.collection.updateOne(
            {
                uid: post.uid
            },
            {
                $pull : {
                    posts: pid
                }
            }
        );
        return (rmPost.deletedCount === 1 ? true : false) && (rmPID.modifiedCount === 1 ? true : false);
    }

    async query(keys) {
        this.collection = this.db.collection('posts');
        let posts = [];
        let order = {};
        const self = this;
        for (let key of keys) {
            let result = await self.collection.find(
                {
                    ingredient_keys: {
                        $all: [key]
                    }
                }
            ).toArray();
            for (let res of result) {
                if (res.pid in order) {
                    order[res.pid] += 1;
                }
                else {
                    order[res.pid] = 1;
                    posts.push(res);
                }
            }
        }
        return posts.sort((a, b) => order[String(a.pid)] > order[String(b.pid)] ? -1 : a.likes < b.likes ? -1 : 1);
    }

    async feedHelper(people) {
        let pids = [];
        for (const person of people) {
            const person_obj = await this.getUser(person);
            for (const pid of person_obj.posts) {
                pids.push(pid);
            }
        }
        this.collection = this.db.collection('posts');
        let posts = [];
        for (const pid of pids) {
            posts.push(await this.getPost(pid));
        }
        return posts.sort((a, b) => {
            let a_split = a.date.split("/");
            let b_split = b.date.split("/");
            const bFirst = (100 *(a_split[2] - b_split[2]) + 10 * (a_split[0] - b_split[0]) + a_split[1] - b_split[1]);
            return bFirst > 0 ? -1 : bFirst === 0 ? -1 : 0;
        });
    }

    async feed(uid) {
        this.collection = this.db.collection('users');
        const user = await this.getUser(uid);
        let follow = user.following;
        return this.feedHelper(follow);
    }

    async defaultFeed() {
        const default_follow = ["noah", "diggy", "piyush", "kenny"];
        return this.feedHelper(default_follow);
    }

    async likePost(uid, pid) {
        //get original post by calling getPost
        let post = await this.getPost(pid);
        //update post to increment like count
        let newLikes = post.likes + 1;
        //see updateUser -> $set
        this.collection = this.db.collection('posts');
        await this.collection.updateOne(
            {
                pid: pid
            },
            {
                $set: {
                    likes: newLikes
                }
            }
        );
        //add pid to uid like list via updateOne, $push (see createPost)
        this.collection = this.db.collection('users');
        await this.collection.updateOne(
            {
                uid: uid
            },
            {
                $push: {
                    "likes": pid
                } 
            }
        );
        return await this.getPost(pid);
    }

    async unlikePost(uid, pid) {
        //reverse of likePost
        let post = await this.getPost(pid);
        this.collection = this.db.collection('posts');
        let newLikes = post.likes - 1;
        await this.collection.updateOne(
            {
                pid: pid
            },
            {
                $set: {
                    likes: newLikes
                }
            }
        );
        //rm pid from uid like list via updateOne, $pull (see deletePost)
        this.collection = this.db.collection('users');
        await this.collection.updateOne(
            {
                uid: uid
            },
            {
                $pull: {
                    "likes": pid
                } 
            }
        );
        return await this.getPost(pid);
    }

    async follow(uid_to, uid_from) {
        this.collection = this.db.collection('users');
        // following array
        await this.collection.updateOne(
            {
                uid: uid_to
            },
            {
                $push: {
                   following: uid_from 
                }
            }
        );
        // followers array
        await this.collection.updateOne(
            {
                uid: uid_from
            },
            {
                $push: {
                    followers: uid_to
                }
            }
        );
        return await this.getUser(uid_from).followers;
    }

    async unfollow(uid_to, uid_from) {
        this.collection = this.db.collection('users');
        // following array
        await this.collection.updateOne(
            {
                uid: uid_to
            },
            {
                $pull: {
                   following: uid_from 
                }
            }
        );
        // followers array
        await this.collection.updateOne(
            {
                uid: uid_from
            },
            {
                $pull: {
                    followers: uid_to
                }
            }
        );
        return await this.getUser(uid_from);
    }

    async createComment(uid, pid, comment) {
        let post = await this.getPost(pid);
        let comments = post.comments
        let cid = -1;
        comments.forEach(res => {
            cid = res.cid > cid ? res.cid : cid;
        });
        cid += 1;
        let newComment = {
            uid: uid,
            cid: cid,
            comment: comment,
            likes: []
        }
        comments.push(newComment);
        comments.sort((a, b) => b.likes.length - a.likes.length);
        this.collection = this.db.collection('posts');
        await this.collection.updateOne(
            {
                pid: pid
            },
            {
                $set: {
                    "comments": comments
                }
            }
        );
        return cid;
    }

    async getComments(pid) {
        //return the comments attribute of post
        const post = await this.getPost(pid);
        return post.comments;
    }

    async getComment(pid, cid) {
        //update comment cid on post pid
        let post = await this.getPost(pid);
        const comments = post.comments
        let comment = {};
        comments.find((o, i) => {
            if (o.cid === cid) {
                comment = comments[i];
                return true; // stop searching
            }
        });
        return comment;
    }

    async deleteComment(pid, cid) {
        let post = await this.getPost(pid);
        let comments = post.comments
        const index = comments.findIndex(o => {
            return o.cid === cid;
        });
        comments.splice(index, 1)
        comments.sort((a, b) => b.likes.length - a.likes.length)
        this.collection = this.db.collection('posts');
        await this.collection.updateOne(
            {
                pid: pid
            },
            {
                $set: {
                    "comments": comments
                }
            }
        );
        return 1;
    }

    async commentLiked(uid, pid, cid) {
        const comments = await this.getComments(pid);
        let b = false
        comments.forEach(c => {
          if (parseInt(c.cid) === cid && c.likes.includes(uid)) {
            b = true;
          }
        });
        return {"value": b};
    }

    async likeComment(uid, pid, cid) {
        let post = await this.getPost(pid);
        let comments = post.comments;
        comments.find((o, i) => {
            if (o.cid === cid) {
                comments[i].likes.push(uid);
                return true; // stop searching
            }
        });
        comments.sort((a, b) => b.likes.length - a.likes.length)
        this.collection = this.db.collection('posts');
        await this.collection.updateOne(
            {
                pid: pid
            },
            {
                $set: {
                    "comments": comments
                }
            }
        );
        return 1;
    }

    async unlikeComment(uid, pid, cid) {
        let post = await this.getPost(pid);
        let comments = post.comments;
        comments.find((o, i) => {
            if (o.cid === cid) {
                let likes = comments[i].likes;
                const index = likes.indexOf(uid);
                likes.splice(index, 1)
                comments[i].likes = likes;
                return true; // stop searching
            }
        });
        comments.sort((a, b) => b.likes.length - a.likes.length)
        this.collection = this.db.collection('posts');
        await this.collection.updateOne(
            {
                pid: pid
            },
            {
                $set: {
                    "comments": comments
                }
            }
        );
        return 1;
    }
}