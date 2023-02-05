# RestauRant

This is a Restaurant Review website built using ReactJS and ExpressJS

This is a web development project done for school.

### Searching:
This project uses the [Fuse.js](https://fusejs.io/) library to search for restaurants.

To refine your search, you can use the following search operators:

|Token|Match type|Description|
|--- |--- |--- |
|jscript|fuzzy-match|Items that fuzzy match jscript|
|=scheme|exact-match|Items that are scheme|
|'python|include-match|Items that include python|
|!ruby|inverse-exact-match|Items that do not include ruby|
|^java|prefix-exact-match|Items that start with java|
|!^earlang|inverse-prefix-exact-match|Items that do not start with earlang|
|.js$|suffix-exact-match|Items that end with .js|
|!.go$|inverse-suffix-exact-match|Items that do not end with .go|
Taken from: https://fusejs.io/examples.html#extended-search

## Installation
1. Clone the repository
2. Run `npm install` in the root directory

## Running the project
1. `node .`<br/> or `npm run express-run`
or
2. Run `npm run build-run` to build the client and run the server.

Alternatively, you can build the client and run server separately.

1. Run `npm run build` to build the client.
2. Run `npm run express-run` to run the server.

### Running the project in development mode
1. `npm run dev` - Runs the vite development server for the react client
2. `npm run express-dev` - Starts the express server with nodemon (auto restart for code changes).
The express server will use the files in `./dist/` folder for its static html pages

## Things to Note:
- See icons from https://icones.js.org/
- Use library [Iconfig](https://docs.iconify.design/iconify-icon/react.html) to use icons from multiple vendors in React
