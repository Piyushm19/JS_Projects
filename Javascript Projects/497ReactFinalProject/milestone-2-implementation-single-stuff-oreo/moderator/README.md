# Moderator #

Author: Piyush Makkapati (piyushm2001)  
This service is responsible for moderating comments. This service will be responsible for a moderated comments postId, commentId, and updated status.
```js
commentsByPostId[postId] = {
  [
    {postId, commId1, status}, 
    {postId, commId2, status}, 
    {postId, commId3, status},
  ]
}
```
This data represents the status that a specific comment achieves when moderated. Moderated data are stored with a postId and contains a comment array whose elements contain the postId, commentId and the updated status of accepted or rejected.
Moderator sends a new post object to the eventbus, moderator, and query for further handling.  
To run this service, run either of following commands from the root folder of the project:
```sh
  cd moderator
  npm start
```
or (to run all services)
```sh
  docker compose up
```

- Event Handler
    - URL: /moderator/events
    - HTTP method: POST
    - Payload: { “event”: “EventToHandle”, “data”: { … } }
    - Response: { “event”: “EventToHandle”, “data”: { ... } }
    - Response Codes:
      - 200: Event handled
      - 404: Incomplete Data
      - 500: Internal Server Error
