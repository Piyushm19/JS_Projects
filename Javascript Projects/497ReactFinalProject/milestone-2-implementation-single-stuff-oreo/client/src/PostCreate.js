import React, { useState } from 'react';
import axios from 'axios';

const PostCreate = ({ username, posts, setPosts }) => {
  const [title, setTitle] = useState('');
  const [desc, setDescription] = useState('');
  const [inst, setInstructions] = useState('');
  
  const onSubmit = async (event) => {
    event.preventDefault();

    const result = await axios.post('http://localhost:4000/posts', {
      username,
      title,
      desc,
      inst,
    });

    const result2 = await axios.get('http://localhost:4002/posts/query');

    const postsNew = {};
    result2.data.forEach(doc => {
      postsNew[doc.postId] = doc;
    });
    setPosts(postsNew);

    setTitle('');
    setDescription('');
    setInstructions('');
    alert("Successfully created a post!");

  };

  return (
    <div className='create-container'>
      <h3>Create Post</h3>
      <form onSubmit={onSubmit}>
        <div className='row'>
          <div className='col-25'>
            <label>Title</label>
          </div>
          <div className='col-75'>
            <textarea className="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)}/>
          </div>
        </div>
        <div className='row'>
          <div className='col-25'>
            <label>Description</label>
          </div>
          <div className='col-75'>
            <textarea className='desc' type="text" value={desc} onChange={(e) => setDescription(e.target.value)}/>
          </div>
        </div>
        <div className='row'>
          <div className='col-25'>
            <label>Instructions</label>
          </div>
          <div className='col-75'>
            <textarea className="inst" type="text" value={inst} onChange={(e) => setInstructions(e.target.value)}/>
          </div>
        </div>
        <button className="btn btn-primary">Post!</button>
      </form>
    </div>
  );
};

export default PostCreate;
