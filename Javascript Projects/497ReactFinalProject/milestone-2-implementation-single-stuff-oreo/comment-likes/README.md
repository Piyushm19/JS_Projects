# Comment Likes #

Author: Diganta Mainali (D-Mainali)

This service is responsible for liking comments. 
It will have a comment’s like count in the form of a list of users.
```js
commentsByPostId[postId] = {
  commentId: [userId1, userId2, userId3,] 
  commentId2: [userId1, userId2, userId3,] 
  commentId3: [userId1, userId2, userId3,] 
}
```
This data represents existing comments and the individual  users that liked them. Likes are stored with postIds and contain key value pairs of commentIds mapping to arrays of all the users which liked the corresponding comment.
Comment like will update a post and its comments using the posts and comments service. It will also send an event to the event bus for handling.
To run this service, run either of following commands from the root folder of the project:
```sh
  cd comment-likes
  npm start
```
or (runs all services)
```sh
  docker compose up
```
- Like a comment.
  - URL: /comment/like
  - HTTP method: POST
  - Payload: { “commentId”: “caf4b55db2”,  “postId”: “bfe3a44ca9”, “userId”: “4fab42cc01” }
  - Response: {  “commentId”: “caf4b55db2”, “postId”: “bfe3a44ca9”, “userId”: “4fab42cc01”, “ likes”: 1 }
  - Response Codes:
    - 201: Comment was successfully liked
    - 400: Incomplete data
    - 404: Post or comment does not exist
    - 500: Internal Server Error
- Unlike a comment.
  - URL: /comment/unlike
  - HTTP method: POST
  - Payload: { “commentId”: “caf4b55db2”, “postId”: “bfe3a44ca9”,  “userId”: “4fab42cc01” }
  - Response: { “commentId”: “caf4b55db2”, “postId”: “bfe3a44ca9”, “userId”: “4fab42cc01”, “likes”: 0 }
  - Response Codes:
    - 201: Comment was successfully liked
    - 400: Incomplete data
    - 404: Post or comment does not exist
    - 500: Internal Server Error
- Event handler
  - URL: /commentLike/events
  - HTTP method: POST
  - Payload: { “event”: “EventToHandle”, “data”: { … } }
  - Response: { “event”: “EventToHandle”, “data”: { ... } }
  - Response Codes:
    - 200: Event handled
    - 404: Incomplete Data
    - 500: Internal Server Error
