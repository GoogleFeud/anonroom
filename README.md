# anonroom

A website for creating anonymous chat rooms. Written entirely in typescript.

WORKING DEMO: https://anonroom-test.glitch.me/

## Built with

- node.js as a backend
  - Typescript is used to ensure type-safety and bug-free code.
  - The `express` npm package provides the web server.
  - The `ws` npm package helps with creating a websocket server.
  - The `mongodb` npm package is used to interact with the mongoDB database.
- On the client-side:
  - Webpack is used to bundle all the files
  - Typescript is used to compile JSX to normal JS
  - React is used to make the user interface
  - React-Router is used to make the website a SPA
  - Bootstrap is used to make the page responsive
- The MongoDB database is used

## Features

- Create chat rooms, with an unlimited amount of participants
- To become an "admin" of the room, type in the room password. Anyone can become an admin, they just need the password.
- The only way users can connect is via a link
- Different colors for each user 
- Room can get locked, preventing people from joining
- Chat can get locked, preventing people from sending messages
- Room can be deleted easily
- Rooms automatically get deleted after 72 hours of inactivity (no messages).
- Message history
- If a discord webhook link is provided, all messages will also be sent via the webhook
- Ability to download message history
- Completely free and open source

## How to run

**Requirements:**
- node.js version 10+ (Latest LTS recommended)
- npm
- A mongoDB cloud database (free tier works just fine)

**Setup:**
- Create the mongoDB cloud database
- Clone the latest version of this repository
- Execute the command `npm i` in the root directory 
- Create a `config.json` file in the root directory, it should look like this:
```
{
     "dbUsername": "user mongoDB cloud username",
     "dbPassword": "user mongoDB cloud password",
     "websiteURL": "The URL to your anonroom instace (http://localhost:port if running locally)",
     "websocketPath": "/gateway",
     "port": 4000,
     "heartbeatInterval": 60000
}
```
- Execute the commands `npm run f` and `npm run b` in the root directory
- Start the server with the command `npm run start`
- Open up your browser and go to the website url you gave in the `config.json` file. 

## Future plans

- Make a non SPA version (SPA is very overkill here)