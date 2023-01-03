const mysql = require("mysql2")

/**
 * Contains basic information about the user
 *
 * @export
 * @typedef UserAccountInfoObject
 * @property {WatchableValue<string|null>} username WatchableValue, value is null when not logged in
 * @property {WatchableValue<string|null>} email WatchableValue, value is null when not logged in
 */

/**
 * Restaurant Type returned by the database
 * @export
 * @typedef RestaurantType
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {{x:number,y:number}} coordinates
 * @property {string} location
 * @property {string} phone_no
 * @property {string} website
 * @property {number} cost_rating
 * @property {number} avg_rating
 * @property {number} review_count
 */
class RestauRantDatabase {
    /**@type {import('mysql2').Connection}*/
    #conn

    /**
     *
     * @param {import('mysql2').ConnectionOptions} options
     * @constructor
     */
    constructor(options) {

        this.#conn = mysql.createConnection(options)
    }


    /**
     * Gets and returns a list of restaurants with specified parameters
     * @param startOffset The offset to start getting the restaurants from.
     * @param limit The maximum number of restaurants to return
     * @return {Promise<RestaurantType[]>}
     */
    GetRestaurants(startOffset = 0, limit = 20, sortby = "cdevrestaurantdatabase.restaurant.id", order = "asc") {
        return new Promise((resolve, reject) => {
            this.#conn.query(`
            SELECT 
            cdevrestaurantdatabase.restaurant.id,
            cdevrestaurantdatabase.restaurant.name,
            cdevrestaurantdatabase.restaurant.description,
            cdevrestaurantdatabase.restaurant.coordinates,
            cdevrestaurantdatabase.restaurant.location,
            cdevrestaurantdatabase.restaurant.phone_no,
            cdevrestaurantdatabase.restaurant.website,
            cdevrestaurantdatabase.restaurant.cost_rating,
            AVG(rating) as avg_rating,
            COUNT(cdevrestaurantdatabase.reviews.id) as reviews_count 
            
             FROM cdevrestaurantdatabase.restaurant
             LEFT OUTER JOIN cdevrestaurantdatabase.reviews ON cdevrestaurantdatabase.restaurant.id=cdevrestaurantdatabase.reviews.restaurant_id
             GROUP BY restaurant_id
             ORDER BY ${sortby} ${order}
             LIMIT ? OFFSET ?;
            `, // Should be find to insert sortby & orderbu here because it is not directly exposed
                [limit, startOffset],
                (err, result, fields) => {
                    if (err) {
                        console.warn("Error while executing GetRestaurants:", err)
                        reject(err)
                    }
                    resolve(result)
                })
        })
    }



}

const RestauRantDB = new RestauRantDatabase({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "admin",
    database: "movie_review"
})

module.exports = {
    RestauRantDB
}
