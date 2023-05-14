import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface commentElement {
  id : string;
  content : string;
  status : string;
  voteCount : number;
}

interface commentsPassedIn {
  comments : commentElement[];
}

const CommentList = ({ comments } : commentsPassedIn) => {
  const renderedComments = comments.map((comment) => {
    return <li key={comment.id}>{comment.status} {comment.content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
