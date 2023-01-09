const {resInternalErr} = require("../errorResponses");
const {RestauRantDB} = require("../database");
const {GetQueryParams} = require("../validateQuery");

/**
 * Get list of reviews for a specific restaurant
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
function getReviews(req, res) {
    let queryParams = GetQueryParams(req,res,{
        start:{default:0,type:"int",min:0},
        limit:{default:10,type:"int",min:0},
        order:{default:"asc",type:"string",enumOptions:["asc","desc"]},
        sortBy:{default:"likes",type:"string",enumOptions:["likes","edit_date"]},
        restaurant_id:{type:"int",min:1},
    })

    if (!queryParams)return


    RestauRantDB.GetReviewForRestaurant(queryParams.restaurant_id, queryParams.start, queryParams.limit, queryParams.sortBy, queryParams.order)
        .then(value => [
            res.json({
                start: queryParams.start,
                limit: queryParams.limit,
                total: value.length,
                results: value
            })
        ])
        .catch(reason => {
            resInternalErr(res, {sqlError: reason})
        })
}


module.exports = {
    getReviews
}
