# Event Bus #

Authors: Kenny Drewry (kendrewry), Piyush Makkapati (piyushm2001), and Author: Diganta Mainali (D-Mainali)

This service is responsible for handling all events. It alerts every service of the event and allows for each service to handle the event individually.
Posts sends a new post object to the eventbus, moderator, and query for further handling.  
To run this service, run either of following commands from the root folder of the project:
```sh
  cd event-bus
  npm start
```
or (to run all services)
```sh
  docker compose up
```
- Event Handler
    - URL: /event-bus/events
    - HTTP method: POST
    - Payload: { “event”: “EventToHandle”, “data”: { … } }
    - Response: { “event”: “EventToHandle”, “data”: { ... } }
    - Response Codes:
      - 200: Event handled
      - 404: Incomplete Data
      - 500: Internal Server Error
