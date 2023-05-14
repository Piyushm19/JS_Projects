# 326-dubblestuforeo - guzzzle.

## Team Overview  
Noah Krueger - noahjkrueger  
Diganta Mainali - D-Mainali  
Kenneth Drewry - kendrewry  
Piyush Makkapati - piyushm2001

## Division of labor

### Noah Krueger

- CRUD database operations and corrosponding endpoints
    - Post CRUD
    - User CRUD
- Session / Authentication features
- Enabled user upload of images
    - Image conversion to base64 for storage
    - For use in profiles and posts
- Addition of buttons for owners of post or user pages
    - Post owners can modify or delete their posts
    - Profile owners can modify or delete their profile
- Bug fixes / Error checking throughout the project
    - Code cleanup
- Coherent Application Navigation
- Restructure of application
- Favicon
- Documentation of Database Documents
- Final Video work
- Heroku Configs
- setup.md rework
- Contributed to final.md

### Diganta Mainali

- CRUD database operations and corresponding endpoints
    - Comment CRUD
    - Post CRUD operation readOtherPosts(pid)
- Restructured all functions/calls in index.js surrounding Comment CRUD
- Session / Authentication features in using request.session to store uid as well as default comment functionality measures
- Bug fixes / Error checking
    - Code cleanup primarily in the Guide page
- Coherent Guide Page with Randomized Following Algorithm implemented to display a fixed range of related guides
- Additions of persistantly updated ability
    - to like and unlike comments without refresh while saving to database
    - to create and delete comments without refresh while saving to database
- Developed comment functionality even further to not be available to the author of a post
- Contributed to final.md
    - Took screenshots and wrote up the User Interface
    - Described all 21 CRUD operations in the API section
- Worked Alongside Piyush to resolve errors in the feed's liking and following functionality
- Code Cleanup and whitespace reorganization
- Database testing and final setup
- Final Video work

### Kenneth Drewry

- Implemented Database calls for Like and Unlike of posts.
    - Includes restructure of functions/calls in index.js
    - Changed feed.js and get_guide.js to display like count correctly when updated        
- Added Create Post button in navbar
- Bug fixes / Error checking
- Code cleanup
- Wrote URL endpoints in final.md
- Edited and Uploaded final video

### Piyush Makkapati

here

### Kenneth Drewry

- Implemented Database calls for Like and Unlike of posts.
    - Includes restructure of functions/calls in index.js
    - Changed feed.js and get_guide.js to display like count correctly when updated        
- Added Create Post button in navbar
- Bug fixes / Error checking
- Code cleanup
- Wrote URL endpoints in final.md
- Edited and Uploaded final video

### Piyush Makkapati

- Implemented Database calls for Follow and Unfollow of users. 
    - Changed around the function/parameters in index.js for manageFollow
    - Needed to change around the following/ unfollowing section in feed.js to correctly follow and unfollow an user.
- Couple small bug fixes here and there for the db file.
- Deployed the fully merged branched onto Heroku 
- Wrote the conclusion in final.md 

## Database Cluster

### Users Collection
    document user {
        _id: <ObjectID>,
        uid: String,
        email: String,
        password: String,
        profileImage: String, 
        biography: String, 
        posts: Array<Integer>, 
        following: Array<String>,
        followers: Array<String>, 
        likes: Array<Integer>
    }

### Posts Collection
    document post {
        pid: Integer,
        uid: String,
        title: String, 
        image: String, 
        date: String, 
        likes: Integer, 
        ingredient_keys: Array<String>, 
        ingredients: String, 
        instructions: String, 
        description : String, 
        comments: Array<Object>, 
    }
