# Favorites #

Author: Kenny Drewry (kendrewry)

This service is responsible for favoriting posts. This service will be responsible for maintaining a user’s favorite posts in the  form of a list of posts.    
```js
favorites[userId] = {
  [
    postId1, 
    postId2, 
    postId3
  ]
}

```
This data represents posts that a specific user favorites. Favorites are stored with userIds and contain a post array representing all the posts that corresponding user favorited.  
Favorites sends a new/updated favorite object to the eventbus, moderator, and query for further handling.  
To run this service, run either of following commands from the root folder of the project:
```sh
  cd favorites
  npm start
```
or (to run all services)
```sh
  docker compose up
```

- Favorite a post
    - URL: /post/favorite
    - HTTP method: POST
    - Payload: { “userId”: “4fab42cc02”, “postId”: “bfe3a44ca9” }
    - Response: {“userId”: “4fab42cc02”, “postId”: “bfe3a44ca9”, “favorites”: 1}
    - Response Codes:
      - 201: Post was successfully favorited
      - 400: Incomplete data
      - 404: User or post doesn’t exist
      - 500: Internal Server Error
- Unfavorite a post
    - URL: /post/unfavorite
    - HTTP method: POST
    - Payload: { “userId”: “4fab42cc02”, “postId”: “bfe3a44ca9” }
    - Response: { “userId”: “4fab42cc02”, “postId”: “bfe3a44ca9”, “favorites”: 0 }
    - Response Codes:
      - 201: Post was successfully unfavorited
      - 400: Incomplete data
      - 404: User or post doesn’t exist
      - 500: Internal Server Error
- Event handler
    - URL: /favorite/events
    - HTTP method: POST
    - Payload: { “event”: “EventToHandle”, “data”: { … } }
    - Response: { “event”: “EventToHandle”, “data”: { ... } }
    - Response Codes:
      - 200: Event handled
      - 404: Incomplete Data
      - 500: Internal Server Error
