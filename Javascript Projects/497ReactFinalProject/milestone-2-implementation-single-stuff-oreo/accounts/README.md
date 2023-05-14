# Accounts #

Author: Piyush Makkapati (piyushm2001)

This service is responsible for creating  users. This service will be responsible for a user’s username and password.    
```js
accounts[userId] = {
	username,
	password
}
```
This data represents new accounts that are created. Account information is stored with a generated userId and contains the email, password, description of user and a profile image.  
Accounts sends a new account object to the eventbus and query for further handling.  
To run this service, run either of following commands from the root folder of the project:
```sh
  cd accounts
  npm start
```
or (to run all services)
```sh
  docker compose up
```
- Log into GruzzleGram.
    - URL: /user/login
    - Method: GET
    - Payload:  { “userId”: “4fab42cc01” }
    - Response: { “userId”: “4fab42cc01”, “status”: “logged in” }
    - Response Codes:
      - 200: User was successfully found and logged in
      - 400: Username or password is incorrect; incomplete data
      - 404: User does not exist
      - 500: Internal Server Error
- Log out of GuzzleGram.
    - URL: /accounts/logout
    - Method: GET
    - Payload: { “userId”: “4fab42cc01” }
    - Response: { “userId”: “4fab42cc01”, “status”: “logged out” }
    - Response Codes:
      - 200: User was successfully found and logged out
      - 400: Incomplete data
      - 500: Internal Server Error
- Get a user's account.
    - URL: /accounts/get
    - Method: GET
    - Payload: { “userId”: “4fab42cc01” }
    - Response: { “userId”: “4fab42cc01”, “username”: “sampleuser”, “password”: “password123”, “posts”: [] }
    - Response Codes:
      - 200: User was successfully found and retrieved
      - 400: Username is missing; incomplete data
      - 404: User does not exist
      - 500: Internal Server Error
- Create a new user.
    - URL: /accounts/create
    - HTTP method: POST
    - Payload: { “username”: “sampleuser”, “password”: “password123” }
    - Response: { “userId”: “4fab42cc01”, “username”: “sampleuser”, “password”: “password123”ion”, “posts”: [] }
    - Response Codes:
      - 201: User was successfully created
      - 400: Username or password is missing; incomplete data
      - 404: Username already exists
      - 500: Internal Server Error
- Event handler
    - URL: /accounts/events
    - HTTP method: POST
    - Payload: { “event”: “EventToHandle”, “data”: { … } }
    - Response: { “event”: “EventToHandle”, “data”: { ... } }
    - Response Codes:
      - 200: Event handled
      - 404: Incomplete Data
      - 500: Internal Server Error
