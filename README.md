# RestauRant

This is a Restaurant Review website built using ReactJS and ExpressJS

Features planned include:
1. A list of restaurants
2. Restaurant ratings in stars out of 10
3. Restaurant average cost
4. Creation of review accounts
5. Posting of reviews with said accounts
6. Rating of reviews with upvotes and downvotes
7. Sorting by price
8. Sorting by proximity
9. to be continued

This is a fullstack web development project done for school.

## Installation
1. Clone the repository
2. Run `npm install` in the root directory

## Running the project
1. node .<br/>
or
2. Run `npm build&run` to build the client and run the server.

Alternatively, you can build the client and run server separately.

1. Run `npm run build` to build the client.
2. Run `npm run express-run` to run the server.

### Running the project in development mode
1. `npm run dev` - Runs the vite development server for the react client
2. `npm run express-dev` - Starts the express server with nodemon (auto restart for code changes).
The express server will use the files in `./dist/` folder for its static html pages

## Thjings to Note:
- See icons from https://icones.js.org/
- Use library [Iconfig](https://docs.iconify.design/iconify-icon/react.html) to use icons from multiple vendors in React

- Use geocoding to convert addresses to coordinates. Do this manually and store it in the database. Google Map Api use requires $$$ :(
