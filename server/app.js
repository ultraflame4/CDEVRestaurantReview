const express = require('express')
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const {redirect} = require("react-router-dom");

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


// Intercept all /app sub path on refresh and send back react client
app.get('/app/*', (req, res) => {
    // When refreshing in the app path, redirect back to react client
    res.sendFile(path.join(__dirname,'../dist/index.html'))
})
app.get('/', (req, res) => {
    // Redirect to react client
    res.redirect("/app")
})

// Test path. _ .
app.get('/test', (req, res) => {
    res.json({test: 'test', date: new Date().toDateString()})
})

app.listen(port,"localhost", () => {
    console.log(`CDEV Restau-Rant app server started at http://localhost:${port}`)
})
