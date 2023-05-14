# 326-dubblestuforeo - guzzzle.

## Team Overview  
Noah Krueger - noahjkrueger  
Diganta Mainali - D-Mainali  
Kenneth Drewry - kendrewry  
Piyush Makkapati - piyushm2001  

## Running the app

### Clone the Repository

In an empty directory, clone the repository:  

    git clone https://github.com/noahjkrueger/326-dubblestuforeo.git

Navigate to the newly cloned repository:  

    cd 326-dubblestuforeo

### Install required packages

Install all required node packages: 

    npm install

### Create .env file

Create a .env file:  

    nano .env

Within the .env file, add the following enviroment variables:  

    PORT="8080" // or whichever port desired
    SECRET="< secret >" // where < secret > is a secret key to enable secure sessions
    DATABASE_URI="< mongodb URI >" // where < mongodb URI > is the link to your database
Make sure to add the .env file to .gitignore, for it contains important information that should be protected.

### Linking to mongodb

The previous step included getting a link to mongodb. The steps to do such are as follows:  
- Navitgate to [Atlas DB](https://www.mongodb.com/atlas/database)
- Create an account
- Create a cluster
- By clicking 'connect' from the cluster, you can connect to application.
- Copy / Paste given string into "< mongodb URI >" in the .env file
- replace < password > with authorized user password.
- For additional help, follow [how to connect to a database](https://www.mongodb.com/docs/atlas/connect-to-database-deployment/)

### Staring the application

Once all is set up correctly, you can start a local server with the command:  

    npm start