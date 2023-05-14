# Comments #

Author: Kenny Drewry (kendrewry)

This service is responsible for creating comments.
It will also be responsible for a comments postId, commentId, content, status and initial likes.
```js
commentsByPostId[postId] = {
  [
    {postId, commId1, content1, status, likes}, 
    {postId, commId2, content2, status, likes}, 
    {postId, commId3, content3, status, likes},
  ]
}
```
This data represents new comments that are created.
Comments are stored with postIds and contain the postId, a generated commentId, 
content of the comment and initial status of under_review and an initialized empty like array.  
Comments sends a new comment object to the eventbus, moderator, and query for further handling, as well as updates the post object associated with the comment.  
To run this service, run either of following commands from the root folder of the project:
```sh
  cd comments
  npm start
```
or
```sh
  docker compose up
```

- Create a new post.
  - URL: /comment/create
  - HTTP method: POST
  - Payload: { “postId”: “bfe3a44ca9”,  “userId”: “4fab42cc01”, “content”: “This is a comment” }
  - Response: { “commentId”: “caf4b55db2”, “postId”: “bfe3a44ca9”, “userId”: “4fab42cc01”, “ content”: “This is a comment” }
  - Response Codes:
    - 201: Comment was successfully created
    - 400: Incomplete data
    - 404: User or post does not exist
    - 500: Internal Server Error
- Event Handler
    - URL: /comment/events
    - HTTP method: POST
    - Payload: { “event”: “EventToHandle”, “data”: { … } }
    - Response: { “event”: “EventToHandle”, “data”: { ... } }
    - Response Codes:
      - 200: Event handled
      - 404: Incomplete Data
      - 500: Internal Server Error
