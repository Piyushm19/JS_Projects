import React, { useState } from 'react';
import PostCreate from './PostCreate';
import PostList from './PostList';
import axios from "axios";

const App = () => {
  const [posts, setPosts] = useState({});
  const [comments, setComments] = useState({});
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const onSubmit = async (event) => {
    event.preventDefault();

    await axios.post('http://localhost:4004/accounts', {
      username,
      password,
    });
    alert("Successfully Logged in!");

  };
  
  return (
    <div className="container">
      <div className='info'>GuzzleGram</div>
      <div className="login-container">
        <form onSubmit={onSubmit}>
          <input
            type="text" 
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login"
          />
          <input 
            type="text" 
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login"
          />
          <button type='submit'>Signup/Login</button>
        </form>
      </div>
      <PostCreate username={username} posts={posts} setPosts={setPosts} />
      <hr />
      <h1>Posts</h1>
      <PostList username={username} posts={posts} setPosts={setPosts} comments={comments} setComments={setComments}/>
    </div>
  );
};

export default App;
