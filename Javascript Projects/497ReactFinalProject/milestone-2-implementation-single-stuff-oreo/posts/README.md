# Posts #

Author: Kenny Drewry (kendrewry)

This service is responsible for creating posts. It will be responsible for a post’s postIds, title, description, instructions, initial likes, and initial favorites.  
```js
posts[postId] = {
  postId, title, description, instructions, likes
}
```
Posts sends a new post object to the eventbus, moderator, and query for further handling.  
To run this service, run either of following commands from the root folder of the project:
```sh
  cd posts
  npm start
```
or (to run all services)
```sh
  docker compose up
```

- Create a new post.
  - URL: /post/create
  - HTTP method: POST
  - Payload: { “title”: “Title of Post”, “description”: “Description of post”, “instructions”: “Instructions of post” }
  - Response: { “postId”: “bfe3a44ca9”, “title”: “Title of Post”, “description”: “Description of post”, “instructions”: “Instructions of post”, “likes”: 0, “favorites”: 0 }
  - Response Codes:
    - 201: User was successfully created
    - 400: Username or password is missing; incomplete data
    - 404: Username already exists
    - 500: Internal Server Error
- Event Handler
    - URL: /post/events
    - HTTP method: POST
    - Payload: { “event”: “EventToHandle”, “data”: { … } }
    - Response: { “event”: “EventToHandle”, “data”: { ... } }
    - Response Codes:
      - 200: Event handled
      - 404: Incomplete Data
      - 500: Internal Server Error
