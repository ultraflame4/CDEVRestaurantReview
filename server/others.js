
const path = require("path");


/**
 * Sets up the controller and redirects for the react client/website.
 * So that :
 * 1. user is automatically redirected to the website.
 * 2. The client/website can manage its own routing of pages using react router.
 *
 * @param app {import("express").Express}
 */
function setupClientRedirects(app){
    // Intercept all /app sub path on refresh and send back react client
    app.get('/app/*', (req, res) => {
        // When refreshing in the app path, redirect back to react client
        res.sendFile(path.join(__dirname, '../dist/index.html'))
    })
    app.get('/', (req, res) => {
        // Redirect to react client
        res.redirect("/app")
    })

}

module.exports = {
    setupClientRedirects
}
