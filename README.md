# ZABONIT
This JS web-app is built on node express, mysql / sequelize.
Utilizes readability api to print contents of given URL link from user.
User is then able to highlight selected text from content to write a comment.
Or user can write a generic comment with regards to that article.

## Requirements:
Requires login with a Google account only at this time to use the app.
Needs a local or remote myqsl database access.

## Helpfull items:

### Install Nodemon

  npm install -g nodemon
  
  
### Install Sequel Pro

  software for Macbook Pro to help visualize mysql databse
  http://www.sequelpro.com/

### Running

* Start the server [using nodemon]

  .../zabonit $ nodemon app.js
  24 Jun 10:30:41 - [nodemon] v0.7.8

  24 Jun 10:30:41 - [nodemon] to restart at any time, enter `rs`
  
  24 Jun 10:30:41 - [nodemon] watching: /Users/combizs/hackreactor/hello/zabonit
  
  24 Jun 10:30:41 - [nodemon] starting `node app.js`
  
  Express server listening on port 3000
  

You should be able to load up the app on [http://localhost:3000].

* Click login and put your Google account credentials. [our database does not save your password]

In another browser window, open the `http://localhost:3000` file.

* Type a URL in the orange box and press enter

When content of article is shown on page:

* Select text from article content to write a specific comment in the blue input field, or just write a generic comment in the blue input field

### Checking data

* Type the connection to the Sequel Pro software and connect to your mysql database
* There are 3 tables that apply to the app: Users, Websites, and Comments

### Known issues

I have noticed that the readability plugin does not always provide the correct article content.  Need to revise how this works: https://github.com/arrix/node-readability
