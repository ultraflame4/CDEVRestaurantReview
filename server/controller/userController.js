const {GetQueryParams, GetJsonParams} = require("../validateQuery");
const {RestauRantDB} = require("../database");
const {resInternalErr} = require("../errorResponses");

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

   RestauRantDB.CreateUser(queryParams.username,queryParams.password,queryParams.email)
      .then(value => {
         res.json({success:true,data:value})
      })
      .catch(err => {
         resInternalErr(res,{success:false,sqlErrors:err})

      })



}


module.exports={
   CreateUser
}
