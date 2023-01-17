const express = require('express')
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const passport = require("passport")
const {Strategy} = require("passport-local")
const session = require("express-session");
const crypto = require("crypto");

const {setupClientRedirects} = require("./others");
const restaurantController = require("./controller/restaurantController");
const reviewsController = require("./controller/reviewsController");
const userController = require("./controller/userController");
const middlewares = require("./middlewares");
const {RestauRantDB} = require("./database");


dotenv.config() // load env variables

const app = express()
const port = process.env.VITE_EXPRESS_PORT

// Set up cross site origin so that the client development server can access api
const allowedOrigins = [
    `http://localhost:${process.env.VITE_EXPRESS_PORT}`,
    `http://localhost:${process.env.VITE_DEV_PORT}`,
   `http://127.0.0.1:${process.env.VITE_EXPRESS_PORT}`
   `http://127.0.0.1:${process.env.VITE_DEV_PORT}`
]

const expressSession = session({
   secret: crypto.randomBytes(512).toString("base64"), // dynamically generate the secret for 'enhanced' security
   resave: false,
   saveUninitialized: false,
   cookie:{
      maxAge:20*60*1000,
      rolling:true
   }
})

// configure passport js
const passportStrategy = new Strategy({
   usernameField: "email", passwordField: "pwd"
}, async (email, password, done) => {
   let usr = await RestauRantDB.FindUser(email)
   if (usr === null) {
      done(null, false, {message: "Invalid Email or Password. No matches found!"})
      return
   }
   let isLoggedIn = await usr.ComparePassword(password)
   if (isLoggedIn){
      done(null, usr)
   }
   else{
      done(null, false, {message: "Invalid Email or Password. No matches found!"})
   }

})

app.use(express.json())

// Serve the static files (the react client) on /app
app.use("/app", express.static(path.join(__dirname, '../dist/')))

app.use(expressSession)
app.use(passport.initialize())
passport.use(passportStrategy)
app.use(passport.session())


passport.serializeUser((_user, done) => {
   /**@type {import("user").User}*/
   let user = _user
   return done(null, user.id);
})
passport.deserializeUser((id, done) => {
   return done(null, {id: id});
})


// Cross-site origin configuration
app.use(cors({
   origin: (origin, callback) => {
      // If origin is from development server aka localhost, allow
      // If origin is undefined aka ourselfs, allow
      if (allowedOrigins.includes(origin) || !origin) {
         return callback(null, true)
      }
      // Else error out
      console.log(`CORS error: origin ${origin} not allowed`)
      return callback(new Error("The CORS policy for this site does not allow access from the specified Origin"), true)
   },

}))


// Test path . _ .
app.get('/api/test', (req, res) => {
   res.json({test: 'test', date: new Date().toDateString()})
})

setupClientRedirects(app)

app.get('/api/restaurants',middlewares.cached(), restaurantController.getRestaurants)
app.get('/api/restaurants/id',middlewares.cached(), restaurantController.getRestaurantsById)
app.get('/api/restaurants/tags',middlewares.cached(), restaurantController.getRestaurantsTags)
app.get('/api/restaurants/photos',middlewares.cached(), restaurantController.getRestaurantsPhotos)


app.get('/api/reviews',middlewares.cached(3), reviewsController.getReviews)
app.post('/api/reviews/create', middlewares.authenticated(), reviewsController.createReview)
app.put('/api/reviews/update', middlewares.authenticated(), reviewsController.updateReview)
app.delete('/api/reviews/delete', middlewares.authenticated(), reviewsController.deleteReview)

app.post('/api/user/create', userController.CreateUser)
app.get('/api/user/test', userController.TestUserLoggedIn)
app.post('/api/user/login', passport.authenticate('local', {failureMessage: true}), userController.LoginUser)
app.delete('/api/user/logout', userController.LogoutUser)
app.get('/api/user/reviews', middlewares.authenticated(),middlewares.cached(3), userController.GetAllReviews)

app.put('/api/user/email', middlewares.authenticated(), userController.UpdateEmail)
app.put('/api/user/password', middlewares.authenticated(), userController.UpdatePassword)
app.put('/api/user/username', middlewares.authenticated(), userController.UpdateUsername)

app.listen(port, "localhost", () => {
   console.log(`CDEV Restau-Rant app server started at http://localhost:${port}`)
})
