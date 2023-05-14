# Post Likes #

Author: Piyush Makkapati (piyushm2001)  
This service is responsible for liking posts. This service will be responsible for a post’s like count in the form of a list of users.  
```js
likes[postId] = {
  [
    userId1, 
    userId2, 
    userId3,
  ] 
}
```
This data represents existing posts and the individual users that liked them. Likes are stored with postIds and contain an array of all the users which liked that specific post.
Post Likes sends a new post object to the eventbus, moderator, and query for further handling, as well as updates the post with its new likes. 
To run this service, run either of following commands from the root folder of the project:
```sh
  cd post-likes
  npm start
```
or (to run all services)
```sh
  docker compose up
```

- Like a post.
    - URL: /post/like
    - HTTP method: POST
    - Payload: { “postId”: “bfe3a44ca9”, “userId”: “4fab42cc01”}
    - Response: { “postId”: “bfe3a44ca9”, “likes”: 1 }
    - Response Codes:
      - 201: Post was successfully liked
      - 400: Incomplete data
      - 404: User or post does not exist
      - 500: Internal Server Error
- Unlike a post.
    - URL: /post/unlike
    - HTTP method: POST
    - Payload: { “postId”: “bfe3a44ca9”, “userId”: “4fab42cc01” }
    - Response: { “postId”: “bfe3a44ca9”, “likes”: 0 }
    - Response Codes:
      - 201: Post was successfully unliked
      - 400: Incomplete data
      - 404: Post does not exist
      - 500: Internal Server Error
- Event handler
    - URL: /post/events
    - HTTP method: POST
    - Payload: { “event”: “EventToHandle”, “data”: { … } }
    - Response: { “event”: “EventToHandle”, “data”: { ... } }
    - Response Codes:
      - 200: Event handled
      - 404: Incomplete Data
      - 500: Internal Server Error
