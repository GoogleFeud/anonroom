# anonroom

A website for creating anonymous chat rooms. Written entirely in typescript.

## Built with

- node.js as a backend
  - Typescript is used to ensure type-safety and bug-free code.
  - The `express` npm package provides the web server.
  - The `ws` npm packagage helps with creating a websocket server.
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
- Completely free and open source
