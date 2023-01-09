const express = require('express')
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const {setupClientRedirects} = require("./others");
const restaurantController = require("./controller/restaurantController");
const reviewsController = require("./controller/reviewsController");

dotenv.config() // load env variables

const app = express()
const port = process.env.VITE_EXPRESS_PORT



// Set up cross site origin so that the client development server can access api
const allowedOrigins = [
    `http://localhost:${process.env.VITE_DEV_PORT}`,
    `http://127.0.0.1:${process.env.VITE_DEV_PORT}`,
]

// Serve the static files (the react client) on /app
app.use("/app",express.static(path.join(__dirname,'../dist/')))

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
app.get('/api/restaurants',restaurantController.getRestaurants)
app.get('/api/nearest_restaurants',restaurantController.getNearestRestaurants)
app.get('/api/reviews',reviewsController.getReviews)


app.listen(port,"localhost", () => {
    console.log(`CDEV Restau-Rant app server started at http://localhost:${port}`)
})
