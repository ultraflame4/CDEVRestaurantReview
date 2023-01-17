const mysql = require("mysql2")
const {User} = require("./user")
const {GetNowTimestamp} = require("./tools");

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
 * @typedef DBRestaurantType
 * @property {number} distance
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
 * @property {string} photo_url
 * @property {string[]} tags
 */

/**
 * Review Type returned by the database
 * @export
 * @typedef DBReviewType
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

/**
 * User Type returned by the database
 * @export
 * @typedef DBUserType
 * @property {number} id
 * @property {string} email
 * @property {string} password_hash
 * @property {string} username
 * @property {string} date_created
 */
/**
 * Restaurant Tags Type returned by the database
 * @export
 * @typedef DBRestaurantTagType
 * @property {number} id
 * @property {string} tag_name
 * @property {number} restaurant_id
 */


class RestauRantDatabase {
   /**@type {import('mysql2').Connection}*/
   #conn;

   /**
    * @param {import('mysql2').ConnectionOptions} options
    * @constructor
    */
   constructor(options) {

      this.#conn = mysql.createConnection(options)
   }

   /**
    * Gets and returns a list of restaurants with specified parameters
    * @param refCoords {{x:number,y:number}} The coords to use against the restaurants' coords when calculating the distance (x: longitude, y: latitude)
    * @param startOffset {number} The offset to start getting the restaurants from.
    * @param limit {number} The maximum number of restaurants to return
    * @param sortBy {"index"|"cost"|"rating"|"reviews"} How to sort the data
    * @param orderAsc {boolean} Whether to order by asc or desc
    * @return {Promise<DBRestaurantType[]>}
    */
   GetRestaurants(refCoords,startOffset = 0, limit = 10, sortBy = "index", orderAsc = true) {
      const sortByMappings = {
         "index": "id",
         "cost": "cost_rating",
         "rating": "avg_rating",
         "reviews": "reviews_count",
         "distance": "distance"
      }
      return new Promise((resolve, reject) => {
         let sortByCol = sortByMappings[sortBy]
         if (!sortByCol) {
            reject(`Invalid sort ${sortBy}`)
         }

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
            COUNT(cdevrestaurantdatabase.reviews.id) as reviews_count,
            (SELECT image_url FROM cdevrestaurantdatabase.restaurant_photos WHERE restaurant_id = cdevrestaurantdatabase.restaurant.id ORDER BY id DESC LIMIT 1) as photo_url,
            (SELECT JSON_ARRAYAGG(tag_name) FROM cdevrestaurantdatabase.restauranttags WHERE restaurant_id = cdevrestaurantdatabase.restaurant.id GROUP BY restaurant_id) as tags
             FROM cdevrestaurantdatabase.restaurant
             LEFT OUTER JOIN cdevrestaurantdatabase.reviews ON cdevrestaurantdatabase.restaurant.id=cdevrestaurantdatabase.reviews.restaurant_id  
             GROUP BY cdevrestaurantdatabase.restaurant.id
             ORDER BY ${sortByCol} ${orderAsc?'ASC':'DESC'}
             LIMIT ? OFFSET ?;
            `, // Should be fine to insert order and sortby here because it is not directly exposed
            [refCoords.x,refCoords.y,limit, startOffset], (err, result, fields) => {
               if (err) {
                  console.warn("Error while executing GetRestaurants:", err)
                  reject(err)
               }
               resolve(result)
            })
      })
   }

   /**
    * Gets a specific restaurant's data
    * @param restaurantId {number} The id of the restaurant
    * @param refCoords {{x:number,y:number}} The coords to use against the restaurants' coords when calculating the distance (x: longitude, y: latitude)
    * @return {Promise<any>}
    */
   GetRestaurantById(refCoords,restaurantId) {

      return new Promise((resolve, reject) => {


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
            COUNT(cdevrestaurantdatabase.reviews.id) as reviews_count,
            (SELECT json_arrayagg(image_url) FROM cdevrestaurantdatabase.restaurant_photos WHERE restaurant_id = ?) as photo_url,
            (SELECT json_arrayagg(tag_name) FROM cdevrestaurantdatabase.restauranttags WHERE restaurant_id = ? GROUP BY restaurant_id) as tags
             FROM cdevrestaurantdatabase.restaurant
             LEFT OUTER JOIN cdevrestaurantdatabase.reviews ON cdevrestaurantdatabase.restaurant.id=cdevrestaurantdatabase.reviews.restaurant_id 
             WHERE cdevrestaurantdatabase.restaurant.id=?
             GROUP BY cdevrestaurantdatabase.restaurant.id

            `, // Should be fine to insert order and sortby here because it is not directly exposed
             [refCoords.x,refCoords.y,restaurantId,restaurantId,restaurantId],
             (err, result, fields) => {
                if (err) {
                   console.warn("Error while executing GetRestaurantById:", err)
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
    * @return {Promise<DBRestaurantType[]>}
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
            [restaurantId, limit, startOffset], (err, result, fields) => {
               if (err) {
                  console.warn("Error while executing GetReviewForRestaurant:", err)
                  reject(err)
               }
               resolve(result)
            })
      })
   }

   /**
    * Finds a user by their email in the database
    * @param email {string}
    * @return {Promise<User|null>} Returns a promise containing ,the User object, or ,null if user not found.
    */
   FindUser(email) {
      return new Promise((resolve, reject) => {
         this.#conn.query(`SELECT * FROM cdevrestaurantdatabase.users WHERE email=? LIMIT 1`, [email], (err, results) => {
            if (err) {
               console.warn("Error while executing FindUser:", err)
               reject(err)
               return
            }
            if (results.length < 1) {
               resolve(null)
               return
            }
            let user_row = results[0]
            /**@type{Date}*/
            let created_date = new Date(user_row.date_created)
            // Convert back to 00:00 time zone. Because the database returns a date with a timezone offset
            created_date.setMinutes(-created_date.getTimezoneOffset() + created_date.getMinutes())

            resolve(new User(user_row.id, user_row.password_hash, user_row.username, user_row.email, created_date))

         })
      })
   }
   /**
    * Finds a user by their id in the database
    * @param id {number}
    * @return {Promise<User|null>} Returns a promise containing ,the User object, or ,null if user not found.
    */
   FindUserById(id) {
      return new Promise((resolve, reject) => {
         this.#conn.query(`SELECT * FROM cdevrestaurantdatabase.users WHERE id=? LIMIT 1`, [id], (err, results) => {
            if (err) {
               console.warn("Error while executing FindUserById:", err)
               reject(err)
               return
            }
            if (results.length < 1) {
               resolve(null)
               return
            }
            let user_row = results[0]
            /**@type{Date}*/
            let created_date = new Date(user_row.date_created)
            // Convert back to 00:00 time zone. Because the database returns a date with a timezone offset
            created_date.setMinutes(-created_date.getTimezoneOffset() + created_date.getMinutes())

            resolve(new User(user_row.id, user_row.password_hash, user_row.username, user_row.email, created_date))

         })
      })
   }

   /**
    * Creates a new user in the database
    * @param username {string}
    * @param password {string}
    * @param email {string}
    * @return {Promise<unknown>}
    */
   async CreateUser(username, password, email) {
      let currentTime = GetNowTimestamp()
      try {
         let hashedPassword = await User.HashUserPassword(password, currentTime)
         return await this._CreateUser(username, hashedPassword, email, currentTime)
      } catch (e) {
         console.error(e)
      }
      throw "Error while creating user"
   }

   /**
    * Retrieves an existing review in the database
    * @param userId {number}
    * @param startOffset {number}
    * @param limit {number}
    * @return {Promise<DBReviewType[]>}
    */
   GetUserReviews(userId, startOffset = 0, limit = 10) {

      return new Promise((resolve, reject) => {
         this.#conn.query(`SELECT * FROM cdevrestaurantdatabase.reviews WHERE author_id=? LIMIT ? OFFSET ?`, [userId, limit, startOffset], (err, result, fields) => {
            if (err) {
               console.warn("Error while executing GetUserReviews:", err)
               reject(err)
               return
            }

            resolve(result)
         })
      })
   }

   _CreateUser(username, hashedpassword, email, currentTime) {

      return new Promise((resolve, reject) => {

         //need to set timezone so that it doesn't convert to utc again
         this.#conn.query(`
            INSERT INTO cdevrestaurantdatabase.users (email,password_hash,username,date_created)
            VALUES (?,?,?,?);
            `, [email, hashedpassword, username, currentTime], (err, results) => {


            if (err) {

               if (err.code === "ER_DUP_ENTRY") {
                  reject(err)
                  return;
               }

               console.warn("Error while executing CreateUser:", err)
               reject(err)
               return
            }
            resolve(results)

         })
      })
   }

   /**
    * Creates a review for a restaurant in the database
    * @param userId {number}
    * @param restaurantId {number}
    * @param reviewContent {string}
    * @param rating {number}
    * @return {Promise<any>}
    */
   CreateReview(userId, restaurantId, reviewContent, rating) {
      let timestamp = GetNowTimestamp()
      return new Promise((resolve, reject) => {
         this.#conn.query(`
         INSERT INTO cdevrestaurantdatabase.reviews
          (restaurant_id,author_id,content,rating,date_created,last_edit,like_count)
            VALUES (?,?,?,?,?,?,?);
         `, [restaurantId, userId, reviewContent, rating, timestamp, timestamp, 0], (err, result, fields) => {
            if (err) {
               console.warn("Error while executing CreateReview:", err)
               reject(err)
               return
            }
            resolve(result)
         })
      })
   }

   /**
    * Updates an existing review for a restaurant in the database
    * @param reviewId {number}
    * @param reviewContent {string}
    * @param rating {number}
    * @return {Promise<any>}
    */
   UpdateReview(reviewId, reviewContent, rating) {
      let timestamp = GetNowTimestamp()
      return new Promise((resolve, reject) => {
         this.#conn.query(`
            UPDATE cdevrestaurantdatabase.reviews
            SET content = ?, rating = ?, last_edit=?
            WHERE id = ?
         `, [reviewContent, rating, timestamp, reviewId], (err, result, fields) => {
            if (err) {
               console.warn("Error while executing UpdateReview:", err)
               reject(err)
               return
            }
            resolve(result)
         })
      })
   }

   /**
    * Retrieves an existing review in the database
    * @param reviewId {number}
    * @return {Promise<DBReviewType[]>}
    */
   GetReview(reviewId) {

      return new Promise((resolve, reject) => {
         this.#conn.query(`SELECT * FROM cdevrestaurantdatabase.reviews WHERE id=? LIMIT 1`, [reviewId], (err, result, fields) => {
            if (err) {
               console.warn("Error while executing GetReview:", err)
               reject(err)
               return
            }
            resolve(result)
         })
      })
   }

   /**
    * Updates an existing review for a restaurant in the database
    * @param reviewId {number}
    * @return {Promise<any>}
    */
   DeleteReview(reviewId) {

      return new Promise((resolve, reject) => {
         this.#conn.query(`
            DELETE FROM cdevrestaurantdatabase.reviews WHERE id = ?
         `, [reviewId], (err, result, fields) => {
            if (err) {
               console.warn("Error while executing DeleteReview:", err)
               reject(err)
               return
            }
            resolve(result)
         })
      })
   }

   /**
    * Updates an existing review for a restaurant in the database
    * @param restaurantId {number}
    * @return {Promise<Array<{image_url:string}>>}
    */
   GetPhotosForRestaurant(restaurantId) {

      return new Promise((resolve, reject) => {
         this.#conn.query(`
            SELECT image_url FROM cdevrestaurantdatabase.restaurant_photos WHERE restaurant_id = ?
         `, [restaurantId], (err, result, fields) => {
            if (err) {
               console.warn("Error while executing GetPhotosForRestaurant:", err)
               reject(err)
               return
            }
            resolve(result)
         })
      })
   }

   /**
    * Updates an existing review for a restaurant in the database
    * @param restaurantId {number}
    * @return {Promise<DBRestaurantTagType[]>}
    */
   GetTagsForRestaurant(restaurantId) {

      return new Promise((resolve, reject) => {
         this.#conn.query(`
            SELECT * FROM cdevrestaurantdatabase.restauranttags WHERE restaurant_id = ?
         `, [restaurantId], (err, result, fields) => {
            if (err) {
               console.warn("Error while executing GetTagsForRestaurant:", err)
               reject(err)
               return
            }
            resolve(result)
         })
      })
   }

   /**
    * Updates a user's username
    * @param userId {number}
    * @param newUsername {string}
    */
   UpdateUsername(userId,newUsername){
      return new Promise((resolve, reject) => {
         this.#conn.query(`
            UPDATE cdevrestaurantdatabase.users SET username = ? WHERE id = ?
         `, [newUsername,userId], (err, result, fields) => {
            if (err) {
               console.warn("Error while executing UpdateUsername:", err)
               reject(err)
               return
            }
            resolve(result)
         })
      })
   }

   /**
    * Updates a user's password
    * @param userId {number}
    * @param newPasswordHash {string}
    * @constructor
    */
   UpdatePassword(userId,newPasswordHash){
      return new Promise((resolve, reject) => {
         this.#conn.query(`
            UPDATE cdevrestaurantdatabase.users SET password_hash = ? WHERE id = ?
         `, [newPasswordHash,userId], (err, result, fields) => {
            if (err) {
               console.warn("Error while executing UpdatePassword:", err)
               reject(err)
               return
            }
            resolve(result)
         })
      })
   }

   /**
    * Updates a user's email
    * @param userId {number}
    * @param newEmail {string}
    * @return {Promise<void>}
    */
   async UpdateEmail(userId, newEmail) {
      return new Promise((resolve, reject) => {
         this.#conn.query(`
            UPDATE cdevrestaurantdatabase.users SET email = ? WHERE id = ?
         `, [newEmail,userId], (err, result, fields) => {
            if (err) {
               console.warn("Error while executing UpdateEmail:", err)
               reject(err)
               return
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
   database: "cdevrestaurantdatabase"
})

module.exports = {
   RestauRantDB
}
