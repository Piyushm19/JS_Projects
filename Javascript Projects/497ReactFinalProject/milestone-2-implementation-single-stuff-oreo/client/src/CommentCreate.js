import React, { useState } from 'react';
import axios from 'axios';

const CommentCreate = ({ username, postId, posts, setPosts }) => {
  const [content, setContent] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();

    await axios.post(
      `http://localhost:4003/comments/${postId}/moderator`,
      {
        username,
        content,
      }
    );

    const result2 = await axios.get('http://localhost:4002/posts/query');

    const postsNew = {};
    result2.data.forEach(doc => {
      postsNew[doc.postId] = doc;
    });
    setPosts(postsNew);

    setContent('');
    alert("Successfully created a comment!");
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-control"
          ></input>
        </div>
        <button className="btn btn-primary">Comment!</button>
      </form>
    </div>
  );
};

export default CommentCreate;
