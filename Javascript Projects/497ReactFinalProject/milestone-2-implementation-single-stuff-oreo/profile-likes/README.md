# Profile Likes #

Author: Diganta Mainali (D-Mainali)

This service is responsible for liking  user profiles. This service will be responsible for a user profile’s likes count in the form of a list of users.
```js
accounts[userId] = {
  [
    userId1, 
    userId2, 
    userId3,
  ] 
}
```
This data represents user profiles that a specific user favorites. Favorites are stored with userIds and contain a user array representing all the user profiles that corresponding user favorited.
Profile Likes sends a new post object to the eventbus, moderator, and query for further handling, as well as updates the profile with its new like count.  
To run this service, run either of following commands from the root folder of the project:
```sh
  cd profile-likes
  npm start
```
or (to run all services)
```sh
  docker compose up
```

- Like a user.
    - URL: /user/like
    - HTTP method: POST
    - Payload: { “userId”: “4fab42cc01”, “targetUserId”: “4fab42cc02” }
    - Response: { “targetUserId”: “4fab42cc02”, “likes”: 1 }
    - Response Codes:
      - 201: User was successfully liked
      - 400: Incomplete data
      - 404: User or targeted user doesn’t exist
      - 500: Internal Server Error
- Unlike a user.
    - URL: /user/unlike
    - HTTP method: POST
    - Payload:  { “userId”: “4fab42cc01”, “targetUserId”: “4fab42cc02” }
    - Response: { “targetUserId”: “4fab42cc02”, “likes”: 0 }
    - Response Codes:
      - 201: User was successfully unliked
      - 400: Incomplete data
      - 404: User or targeted user doesn’t exist
      - 500: Internal Server Error
- Event handler
  - URL: /user/events
  - HTTP method: POST
  - Payload: { “event”: “EventToHandle”, “data”: { … } }
  - Response: { “event”: “EventToHandle”, “data”: { ... } }
  - Response Codes:
      - 200: Event handled
      - 404: Incomplete Data
      - 500: Internal Server Error
