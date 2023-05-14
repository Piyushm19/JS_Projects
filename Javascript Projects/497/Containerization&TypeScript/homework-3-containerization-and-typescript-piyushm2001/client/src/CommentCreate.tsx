import React, { useState } from 'react';
import axios from 'axios';

interface postIdPassedIn {
  postId : string;
}

const CommentCreate = ({ postId } : postIdPassedIn) => {
  const [content, setContent] : [content : string, setContent : any]= useState('');

  const onSubmit = async (event : any) => {
    event.preventDefault();

    await axios.post(`http://localhost:4001/posts/${postId}/comments`, {
      content,
    });

    setContent('');
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <input
            value={content}
            onChange={(e : any) => setContent(e.target.value)}
            className="form-control"
          ></input>
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default CommentCreate;
