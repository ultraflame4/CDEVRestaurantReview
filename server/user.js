const crypto = require("crypto")
const {FormatTimestamp} = require("./tools");

/**
 * This class represents a User in a database.
 * It includes some helpful functions to retrieve additional data (eg. reviews) from the database.
 */
class User {
   /** @type {number}*/
   #id
   /** @type {string}*/
   #pwd_hash;
   /** @type {string}*/
   #username;
   /** @type {string}*/
   #email;
   /** @type {Date}*/
   #date_created;


   constructor(id, pwd_hash, username, email, date_created) {
      this.#id = id;
      this.#pwd_hash = pwd_hash;
      this.#username = username;
      this.#email = email;
      this.#date_created = date_created;
   }


   get id() {
      return this.#id;
   }
   get pwd_hash() {
      return this.#pwd_hash;
   }
   get username() {
      return this.#username;
   }
   get email() {
      return this.#email;
   }
   get date_created() {
      return this.#date_created;
   }
   /**
    * Checks if the given password matches this user in the database. This will also automaticalled salt and hash the password
    * @param password {string} un-hashed password
    * @return {Promise<boolean>}
    */
   async ComparePassword(password) {

      let hashed = await User.HashUserPassword(password,FormatTimestamp(this.date_created))

      return hashed===this.#pwd_hash;
   }

   /**
    * Hashes a password of a user
    * @param password {string} The user's password
    * @param date_created {string} The user's account date of creation. Also used as salt for the password hash.
    * @return {Promise<string>}
    */
   static HashUserPassword(password,date_created){
      let salt = date_created
      return new Promise((resolve) => {
         let hashedPassword = crypto.pbkdf2Sync(password,salt,2000,127,"sha512")
         resolve(hashedPassword.toString("hex"))
      })
   }
}

module.exports={
   User
}
