import React, { useState } from 'react';
import axios from 'axios';

const PostCreate = () => {
  const [title, setTitle] : [title : string, setTitle : any] = useState('');

  const onSubmit = async (event : any) => {
    event.preventDefault();

    await axios.post('http://localhost:4000/posts', {
      title,
    });

    setTitle('');
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title: {title}</label>
          <input
            value={title}
            onChange={(e : any) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default PostCreate;
