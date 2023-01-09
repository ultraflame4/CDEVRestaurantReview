const mysql = require("mysql2")
const {bool} = require("prop-types");

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

/**
 * Review Type returned by the database
 * @export
 * @typedef ReviewType
 * @property {number} id
 * @property {number} restaurant_id
 * @property {number} author_id
 * @property {string} content
 * @property {number} rating
 * @property {string} date_created
 * @property {string} last_edited
 * @property {number} like_count
 * @property {string} username
 */


class RestauRantDatabase {
    /**@type {import('mysql2').Connection}*/
    #conn;

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
     * @param startOffset {number} The offset to start getting the restaurants from.
     * @param limit {number} The maximum number of restaurants to return
     * @param sortBy {"index"|"cost"|"rating"|"reviews"} How to sort the data
     * @param orderAsc {boolean} Whether to order by asc or desc
     * @return {Promise<RestaurantType[]>}
     */
    GetRestaurants(startOffset = 0, limit = 20, sortBy = "index", orderAsc = true) {
        const sortByMappings = {
            "index": "id",
            "cost": "cost_rating",
            "rating": "avg_rating",
            "reviews": "reviews_count"
        }
        return new Promise((resolve, reject) => {
            let sortByCol = sortByMappings[sortBy]
            if (!sortByCol) {
                reject(`Invalid sort ${sortBy}`)
            }

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
             ORDER BY ${sortByCol} ${orderAsc?'ASC':'DESC'}
             LIMIT ? OFFSET ?;
            `, // Should be fine to insert order and sortby here because it is not directly exposed
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


    /**
     * Returns the list of restaurants sort by distance in descending order
     * @param refCoords {{x:number,y:number}} The coords to use against the restaurants' coords when calculating the distance (x: longitude, y: latitude)
     * @param startOffset {number} The offset to start getting the restaurants from.
     * @param limit {number} The maximum number of restaurants to return
     * @return
     */
    GetRestaurantSortDistance(refCoords, startOffset = 0, limit = 20) {
        return new Promise((resolve, reject)=>{
            this.#conn.query(`
            SELECT
            ST_Distance_Sphere(
                POINT(?, ?),
                cdevrestaurantdatabase.restaurant.coordinates
                ) as distance,
                
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
             ORDER BY distance ASC
             LIMIT ? OFFSET ?;
            `, // Should be fine to insert order and sortby here because it is not directly exposed
                [refCoords.x,refCoords.y,limit, startOffset],
                (err, result, fields) => {
                    if (err) {
                        console.warn("Error while executing GetRestaurants:", err)
                        reject(err)
                    }
                    resolve(result)
                })
        })

    }

    /**
     * Gets and returns a list of reviews for a specified restuarant
     *
     * @param restaurantId {number}
     * @param startOffset {number}
     * @param limit {number}
     * @param sortBy {"like"|"edit_date"}
     * @param orderAsc {boolean}
     * @return {Promise<RestaurantType[]>}
     */
    GetReviewForRestaurant(restaurantId, startOffset = 0, limit = 10, sortBy = "like", orderAsc = true) {
        const sortByMappings = {
            "likes": "like_count",
            "edit_date": "last_edit"
        }

        return new Promise((resolve, reject) => {
            let sortByCol = sortByMappings[sortBy]
            if (!sortByCol) {
                reject(`Invalid sort ${sortBy}`)
            }

            this.#conn.query(`
            SELECT
            *, 
            (SELECT username FROM cdevrestaurantdatabase.users WHERE users.id=reviews.author_id) as username 
            FROM cdevrestaurantdatabase.reviews 
            WHERE reviews.restaurant_id = ?
             ORDER BY ${sortByCol} ${orderAsc?'ASC':'DESC'}
             LIMIT ? OFFSET ?;
            `, // Should be fine to insert order and sortby here because it is not directly exposed
            [restaurantId, limit, startOffset],
            (err, result, fields) => {
                if (err) {
                    console.warn("Error while executing GetReviewForRestaurant:", err)
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
