import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommentList = ({ username, postId, comments}) => {
  const renderedComments = comments.map((comment) => {

    const like = async function() {
      alert("Successfully liked the comment!");
      const commId = comment.id;

      //Sends like to commentlike service
      await axios.post(`http://localhost:4007/commentlikes`, {
        username,
        commId,
        postId,
      });
    };

    return (
      <div>
        <li key={comment.id}>{comment.content} Votes: {comment.likes} Status: {comment.status}</li>
        <button className='btn-commentLike' onClick={like}>Like</button>
      </div>
    );
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
