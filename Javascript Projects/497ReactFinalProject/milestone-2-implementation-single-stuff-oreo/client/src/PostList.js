import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CommentCreate from './CommentCreate';
import CommentList from './CommentList';

const PostList = ({ username, posts, setPosts}) => {
  const fetchPosts = async () => {
    // const res = await axios.get('http://localhost:4002/posts');
    // setPosts(res.data);
    // const res = await axios.get(`http://localhost:4002/posts/${username}/query`);
    // setPosts(res.data);
    const res = await axios.get('http://localhost:4002/posts/query');
    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const renderedPosts = Object.values(posts).map((p) => {

    const fav = async (event) => {
      alert("Successfully favorited the post!");
      event.preventDefault();
    
      const result = await axios.post("http://localhost:4009/fav", {
        username,
        postId: p.postId
      });
    
    };

    const prof = async (event) => {
      alert("Successfully liked the profile!");
      event.preventDefault();
    
      const result = await axios.post('/http://localhost:4008/profilelikes', {
        author: p.username,
        username: username,
      });
    }

    const pos = async (event) => {
      alert("Successfully liked a post!");
      event.preventDefault();
      const result = await axios.post('/http://localhost:4006/postlikes', {
        author: p.username,
        username: username,
        postId: p.postId,
      });
    
    };

    return (
      <div
        className="card"
        style={{ width: '30%', marginBottom: '20px' }}
        key={p.id}
      >
        <div className="card-body">
          <h2>{p.username}</h2>
          <button onClick={prof}>ProfileLike</button>
          <h3>{p.title}</h3>
          <div className='desc'>{p.desc}</div>
          <div className='inst'>{p.inst}</div>
          <CommentCreate username={username} postId={p.postId} posts={posts} setPosts={setPosts} />
          <CommentList username={username} postId={p.postId} comments={p.comments} />
          <button onClick={pos}>PostLike</button>
          {/* <span>{p.postlikes.length}</span> */}
          <button onClick={fav}>Favorite</button>
        </div>
      </div>
    );
  });

  return (
    <div className="post-list">
      {renderedPosts}
    </div>
  );
};

export default PostList;
