const {GetQueryParams, GetJsonParams} = require("../validateQuery");
const {RestauRantDB} = require("../database");
const {resInternalErr, resUnauthorised} = require("../errorResponses");
const {IsLoggedIn} = require("../tools");

/**
 *
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
function CreateUser(req, res) {
   let queryParams = GetJsonParams(req, res, {
      username: {type: "string"}, password: {type: "string"}, email: {type: "string"}
   })
   if (!queryParams) return;

   RestauRantDB.FindUser(queryParams.email).then(value => {
      if (value !== null) {
         res.status(400).json({success: false})
         return
      }
      RestauRantDB.CreateUser(queryParams.username, queryParams.password, queryParams.email)
         .then(value => {
            res.json({success: true, data: value})
         })
         .catch(err => {
            resInternalErr(res, {success: false, sqlErrors: err})
         })
   })
}

/**
 *
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
function TestUserLoggedIn(req, res) {
   res.status(200).json({isLoggedIn: IsLoggedIn(req), isAuth: req.isAuthenticated(), userid: req.user?.id})
}

/**
 *
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
function LoginUser(req, res) {
   res.status(200).json({success: IsLoggedIn(req)})
}

/**
 *
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
function LogoutUser(req, res) {
   req.logout(err => {
   })
   res.redirect("/api/user/test")

}

/**
 * Gets all reviews by the logged in user
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
function GetAllReviews(req, res) {
   let queryParams = GetQueryParams(req,res,{
      start:{default:0,type:"int",min:0},
      limit:{default:10,type:"int",min:0,max:15}
   })
   if (req.isAuthenticated()) {
      RestauRantDB.GetUserReviews(req.user.id,queryParams.start,queryParams.limit).then(value => {
         res.json({
            start: queryParams.start,
            limit: queryParams.limit,
            total: value.length,
            reviews: value
         })
      }).catch(err => {
         resInternalErr(res, {success: false, sqlErrors: err})
      })

      return
   }
   resUnauthorised(res)
}


module.exports = {
   CreateUser, TestUserLoggedIn, LoginUser, LogoutUser, GetAllReviews
}
