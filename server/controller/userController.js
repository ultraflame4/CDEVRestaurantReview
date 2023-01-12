const {GetQueryParams, GetJsonParams} = require("../validateQuery");
const {RestauRantDB} = require("../database");
const {resInternalErr} = require("../errorResponses");
const {IsLoggedIn} = require("../tools");

/**
 *
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
function CreateUser(req, res) {
   let queryParams = GetJsonParams(req,res,{
      username:{type:"string"},
      password:{type:"string"},
      email:{type:"string"}
   })
   if (!queryParams) return;

   RestauRantDB.FindUser(queryParams.email).then(value => {
      if (value!==null){
         res.status(400).json({success:false})
         return
      }
      RestauRantDB.CreateUser(queryParams.username,queryParams.password,queryParams.email)
         .then(value => {
            res.json({success:true,data:value})
         })
         .catch(err => {
            resInternalErr(res,{success:false,sqlErrors:err})
         })

   })


}
/**
 *
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
function TestUserLoggedIn(req, res) {
   res.status(200).json({isLoggedIn:IsLoggedIn(req),isAuth:req.isAuthenticated(),userid:req.user?.id})
}

/**
 *
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
function LoginUser(req, res) {
   res.status(200).json({success:IsLoggedIn(req)})
}

/**
 *
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
function LogoutUser(req, res) {
   req.logout(err => {})
   res.redirect("/api/user/test")

}


module.exports={
   CreateUser,
   TestUserLoggedIn,
   LoginUser,
   LogoutUser
}
