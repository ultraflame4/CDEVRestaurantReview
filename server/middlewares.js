const passport = require("passport");
const {resUnauthorised} = require("./errorResponses");

/**
 *
 * @callback ExpressMiddleware
 * @param {import("express").request} req
 * @param {import("express").response} res
 * @param {import("express").NextFunction} next
 * @returns {void}
 */


/**
 *
 * @return {ExpressMiddleware}
 */
function authenticated() {

   return (req, res, next) => {
      passport.session()(req, res, () => {
         if (req.isAuthenticated()){
            next()
            return
         }
         resUnauthorised(res)
      })
   }
}


module.exports = {
   authenticated
}
