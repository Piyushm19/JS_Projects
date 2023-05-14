# Query #

Author: Diganta Mainali (D-Mainali)

This service is responsible for querying all individual service data into one easily accessible database.
```js
accounts[userId] = {
  username,
  password,
  description,
  instructions,
  favorites : [postId1, postId2, postId3]
  profileLikes : [userId1, userId2, userId3],
  posts : {	
    postId1: {
      title1,
      img1, 
      description1, 
      postLikes : [userId1, userId2, userId3],
      comments: [{
        postId, 
        commId1, 
        content1,
        commentLikes: [userId1, userId2, userId3],
        status,
      }]
    }
  }

```
This data represents the culmination of the data represented by the other 8 services. The Query data is stored by userIds and contains email, password, user description, favorites array, profileLikes array and key value pairs representing individual posts and all their information. 
The value of such a pair contains postId, title of post, image of post, description of post (instructions/ingredients), a postlike array and a comments key value pair. The value of the comments key consists of an array of comments. Each comment consists of a postId, commentId, content of the comment, a commentLikes array and the status of the comment. 
Posts sends a new post object to the eventbus, moderator, and query for further handling.  
To run this service, run either of following commands from the root folder of the project:
```sh
  cd query
  npm start
```
or (to run all services)
```sh
  docker compose up
```
- Event Handler
    - URL: /query/events
    - HTTP method: POST
    - Payload: { “event”: “EventToHandle”, “data”: { … } }
    - Response: { “event”: “EventToHandle”, “data”: { ... } }
    - Response Codes:
      - 200: Event handled
      - 404: Incomplete Data
      - 500: Internal Server Error
